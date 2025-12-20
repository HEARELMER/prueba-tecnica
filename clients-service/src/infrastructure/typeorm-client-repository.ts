import { Repository } from "typeorm";
import { ClientRepository } from "../domain/client-repository";
import { ClientEntity } from "./typeorm-client-entity";

export class TypeOrmClientRepository implements ClientRepository {
  constructor(private readonly repo: Repository<ClientEntity>) {}

  async save(input: { name: string; email: string; securityCode: string }) {
    const saved = await this.repo.save({
      name: input.name,
      email: input.email,
      securityCode: input.securityCode,
    });

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      securityCode: saved.securityCode,
      createdAt: saved.createdAt,
    };
  }
}
