import { TokenRepository } from "../domain/token-repository";

export class ValidateToken {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(code: string): Promise<boolean> {
    const token = await this.tokenRepository.findByCode(code);
    return Boolean(token);
  }
}
