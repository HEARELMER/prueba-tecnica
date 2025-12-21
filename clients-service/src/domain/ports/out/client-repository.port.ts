import { Client } from "../../entities/client";

export interface ClientRepositoryPort {
  save(client: Client): Promise<Client>;
}
