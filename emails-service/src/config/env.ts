import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const rabbitHost = process.env.RABBIT_HOST || "localhost";
const rabbitPort = Number(process.env.RABBIT_PORT || 5672);
const rabbitUser = process.env.RABBIT_USER || "guest";
const rabbitPass = process.env.RABBIT_PASS || "guest";

// Build URL from RABBIT_HOST unless an explicit URL is provided.
const rabbitUrl =
  process.env.RABBITMQ_URL ||
  `amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`;

export const env = {
  port: Number(process.env.PORT || 3002),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || process.env.DB_USER || "root",
    password: process.env.DB_PASS || process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "db_emails",
  },
  rabbitmq: {
    url: rabbitUrl,
    emailQueue: process.env.EMAIL_QUEUE || "client_registered",
  },
};
