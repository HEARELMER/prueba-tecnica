import { Server } from "@hapi/hapi";
import axios from "axios";
import { connect as connectRabbit, Connection, Channel } from "amqplib";
import { env } from "./config/env";
import { appDataSource } from "./config/database";
import { HttpSecurityGateway } from "./infrastructure/http-security-gateway";
import { RedisEmailToggleReader } from "./infrastructure/redis-email-toggle-reader";
import { RabbitMqEmailPublisher } from "./infrastructure/rabbitmq-email-publisher";
import { TypeOrmClientRepository } from "./infrastructure/typeorm-client-repository";
import { ClientEntity } from "./infrastructure/typeorm-client-entity";
import { RegisterClient } from "./application/register-client";
import { registerRoutes } from "./infrastructure/routes";
const Redis = require("ioredis");
async function buildServer(): Promise<Server> {
  const server = new Server({ port: env.port, host: "localhost" });

  await appDataSource.initialize();
  const repo = new TypeOrmClientRepository(
    appDataSource.getRepository(ClientEntity)
  );

  const securityClient = axios.create({
    baseURL: env.securityBaseUrl,
    timeout: 3_000,
  });
  const securityGateway = new HttpSecurityGateway(securityClient);

  const redis = new Redis({ host: env.redis.host, port: env.redis.port });
  const toggleReader = new RedisEmailToggleReader(redis);

  // const rabbitConnection: Connection = await connectRabbit(env.rabbitmq.url);
  // const rabbitChannel: Channel = await rabbitConnection.createChannel();
  // const publisher = new RabbitMqEmailPublisher(
  //   rabbitChannel,
  //   env.rabbitmq.emailQueue
  // );

  // const registerClient = new RegisterClient(
  //   securityGateway,
  //   toggleReader,
  //   publisher,
  //   repo
  // );

  // registerRoutes(server, { registerClient });

  server.ext("onPostStart", () => {
    console.info(`[clients] Hapi server ready at ${server.info.uri}`);
    return undefined;
  });

  server.ext("onPostStop", async () => {
    await appDataSource.destroy();
    await redis.quit();
    // await rabbitChannel.close();
    // await rabbitConnection.close();
  });

  return server;
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
