import { Server } from "@hapi/hapi";
import { env } from "./config/env";
import { appDataSource } from "./config/database";
import { ProcessEmailRequest } from "./application/process-email-request";
import {
  EmailLogEntity,
  RabbitMqConsumer,
  TypeOrmEmailLogRepository,
  registerRoutes,
} from "./infrastructure/export";

async function buildServer(): Promise<{
  server: Server;
  consumer: RabbitMqConsumer;
}> {
  // Bind to all interfaces so it is reachable inside Docker network
  const server = new Server({ port: env.port, host: "0.0.0.0" });
  registerRoutes(server);

  await appDataSource.initialize();
  const repo = new TypeOrmEmailLogRepository(
    appDataSource.getRepository(EmailLogEntity)
  );
  const processEmail = new ProcessEmailRequest(repo);

  const consumer = new RabbitMqConsumer(
    env.rabbitmq.url,
    env.rabbitmq.emailQueue,
    processEmail
  );

  return { server, consumer };
}

async function start() {
  try {
    const { server, consumer } = await buildServer();

    // Start background consumer before exposing HTTP.
    await consumer.start();

    server.ext("onPostStart", () => {
      console.info(`[emails] Hapi server ready at ${server.info.uri}`);
      return undefined;
    });

    server.ext("onPostStop", async () => {
      await consumer.stop();
      await appDataSource.destroy();
    });

    await server.start();
  } catch (err) {
    console.error("Failed to start emails service", err);
    process.exit(1);
  }
}

start();
