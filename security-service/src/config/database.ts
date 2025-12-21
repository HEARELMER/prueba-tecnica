import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env"; 
import { TokenEntity } from "../infrastructure/export";

export const appDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [TokenEntity],
  synchronize: true,
});
