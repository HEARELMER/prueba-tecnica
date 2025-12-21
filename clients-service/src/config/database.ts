import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { ClientEntity } from "../infrastructure/adapters/typeorm/client.entity";
import { GlobalParameterEntity } from "../infrastructure/adapters/typeorm/global-parameter.entity";

export const appDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [ClientEntity, GlobalParameterEntity],
  synchronize: true,
});
