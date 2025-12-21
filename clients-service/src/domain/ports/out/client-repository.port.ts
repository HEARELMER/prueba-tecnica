import { Client } from "../../client";

export interface ClientRepositoryPort {
  save(client: Client): Promise<Client>;
}
