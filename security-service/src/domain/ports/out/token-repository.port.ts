import { Token } from "../../entities/token";

export interface TokenRepositoryPort {
  save(token: Token): Promise<Token>;
  findByCode(tokenCode: string): Promise<Token | null>;
}
