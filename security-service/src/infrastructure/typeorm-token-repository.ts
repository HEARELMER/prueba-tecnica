import { Repository } from "typeorm";
import { TokenRepository } from "../domain/token-repository";
import { TokenEntity } from "./typeorm-token-entity";

export class TypeOrmTokenRepository implements TokenRepository {
  constructor(private readonly repo: Repository<TokenEntity>) {}

  async save(
    code: string
  ): Promise<{ id: string; code: string; createdAt: Date }> {
    const saved = await this.repo.save({ code });
    return { id: saved.id, code: saved.code, createdAt: saved.createdAt };
  }

  async findByCode(
    code: string
  ): Promise<{ id: string; code: string; createdAt: Date } | null> {
    const token = await this.repo.findOne({ where: { code } });
    return token
      ? { id: token.id, code: token.code, createdAt: token.createdAt }
      : null;
  }
}
