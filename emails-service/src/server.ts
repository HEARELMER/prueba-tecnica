import { Server } from "@hapi/hapi";
import { Channel, connect as connectRabbit } from "amqplib";
import { env } from "./config/env";
import { appDataSource } from "./config/database";
import { TypeOrmEmailLogRepository } from "./infrastructure/typeorm-email-log-repository";
import { EmailLogEntity } from "./infrastructure/typeorm-email-log-entity";
import { ProcessEmailRequest } from "./application/process-email-request";
import { RabbitMqConsumer } from "./infrastructure/rabbitmq-consumer";
import { registerRoutes } from "./infrastructure/routes";

async function buildServer(): Promise<{
  server: Server;
  consumer: RabbitMqConsumer;
  connectionClose: () => Promise<void>;
}> {
  const server = new Server({ port: env.port, host: "localhost" });
  registerRoutes(server);

  await appDataSource.initialize();
  const repo = new TypeOrmEmailLogRepository(
    appDataSource.getRepository(EmailLogEntity)
  );
  const processEmail = new ProcessEmailRequest(repo);

  const connection = await connectRabbit(env.rabbitmq.url);
  const channel: Channel = await connection.createChannel();
  const consumer = new RabbitMqConsumer(
    channel,
    env.rabbitmq.emailQueue,
    processEmail
  );

  const connectionClose = async () => {
    await appDataSource.destroy();
    await channel.close();
    await connection.close();
  };

  return { server, consumer, connectionClose };
}

async function start() {
  try {
    const { server, consumer, connectionClose } = await buildServer();

    // Start background consumer before exposing HTTP.
    await consumer.start();

    server.ext("onPostStart", () => {
      console.info(`[emails] Hapi server ready at ${server.info.uri}`);
      return undefined;
    });

    server.ext("onPostStop", async () => {
      await connectionClose();
    });

    await server.start();
  } catch (err) {
    console.error("Failed to start emails service", err);
    process.exit(1);
  }
}

start();
