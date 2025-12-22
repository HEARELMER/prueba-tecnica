import { Repository } from "typeorm";
import { TokenEntity } from "./token.entity";
import { Token } from "../../../domain/entities/token";
import { TokenRepositoryPort } from "../../../domain/ports/out/token-repository.port";

export class TypeOrmTokenRepository implements TokenRepositoryPort {
  constructor(private readonly repo: Repository<TokenEntity>) {}

  async save(token: Token): Promise<Token> {
    const persisted = await this.repo.save({
      id: token.id,
      tokenCode: token.tokenCode,
      isActive: token.isActive,
    });

    return this.mapToDomain(persisted);
  }

  async findByCode(tokenCode: string): Promise<Token | null> {
    const token = await this.repo.findOne({ where: { tokenCode } });
    return token ? this.mapToDomain(token) : null;
  }

  private mapToDomain(entity: TokenEntity): Token {
    return {
      id: entity.id,
      tokenCode: entity.tokenCode,
      createdAt: entity.createdAt,
      isActive: entity.isActive,
    };
  }
}
