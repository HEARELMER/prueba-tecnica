import { Server } from "@hapi/hapi";
import axios from "axios";
import { connect as connectRabbit, ChannelModel, Channel } from "amqplib";
import Redis from "ioredis";
import { env } from "./config/env";
import { appDataSource } from "./config/database";
import { RegisterClient } from "./application/register-client";
import {
  ApiRoutes,
  HttpSecurityGateway,
  RedisEmailToggleReader,
  RabbitMqEmailPublisher,
  TypeOrmClientRepository,
  TypeOrmGlobalParameterRepository,
  ClientEntity,
  GlobalParameterEntity,
} from "./infrastructure/export";
async function buildServer(): Promise<Server> {
  // Bind to all interfaces so it is reachable inside Docker network
  const server = new Server({ port: env.port, host: "0.0.0.0" });

  await appDataSource.initialize();

  const clientRepo = new TypeOrmClientRepository(
    appDataSource.getRepository(ClientEntity)
  );
  const globalParamRepo = new TypeOrmGlobalParameterRepository(
    appDataSource.getRepository(GlobalParameterEntity)
  );

  const securityClient = axios.create({
    baseURL: env.securityBaseUrl,
    timeout: 3_000,
  });
  const securityGateway = new HttpSecurityGateway(securityClient);

  const redis = new Redis({ host: env.redis.host, port: env.redis.port });

  // Ensure parameters exist and are loaded into Redis at startup.
  await bootstrapGlobalParameters(globalParamRepo, redis);

  const toggleReader = new RedisEmailToggleReader(redis, globalParamRepo);

  const rabbitConnection: ChannelModel = await connectRabbit(env.rabbitmq.url);
  const rabbitChannel: Channel = await rabbitConnection.createChannel();
  const publisher = new RabbitMqEmailPublisher(
    rabbitChannel,
    env.rabbitmq.emailQueue
  );

  const registerClient = new RegisterClient(
    securityGateway,
    toggleReader,
    publisher,
    clientRepo
  );

  const apiRoutes = new ApiRoutes(registerClient);
  apiRoutes.register(server);

  server.ext("onPostStart", () => {
    console.info(`[clients] Hapi server ready at ${server.info.uri}`);
    return undefined;
  });

  server.ext("onPostStop", async () => {
    await appDataSource.destroy();
    await redis.quit();
    await rabbitChannel.close();
    await rabbitConnection.close();
  });

  return server;
}

async function bootstrapGlobalParameters(
  globalParamRepo: TypeOrmGlobalParameterRepository,
  redis: Redis
): Promise<void> {
  // Default toggle to allow welcome emails unless explicitly disabled.
  await globalParamRepo.upsert("ENABLE_EMAIL", "true");

  const params = await globalParamRepo.findAll();
  if (params.length === 0) return;

  const pipeline = redis.pipeline();
  params.forEach((p) => pipeline.set(p.key, p.value));
  await pipeline.exec();
}

async function start() {
  try {
    const server = await buildServer();
    await server.start();
  } catch (err) {
    console.error("Failed to start clients service", err);
    process.exit(1);
  }
}

start();
