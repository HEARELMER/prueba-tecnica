import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || "root",
    // Allow DB_PASS for backward compatibility with compose vars.
    password: process.env.DB_PASSWORD || process.env.DB_PASS || "root",
    // Align default with the database created in mysql-initi/init.sql
    database: process.env.DB_NAME || "db_clients",
  },
  securityBaseUrl: process.env.SECURITY_BASE_URL || "http://localhost:3001",
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
    emailQueue: process.env.EMAIL_QUEUE || "emails",
  },
};
