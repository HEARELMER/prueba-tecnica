import { TokenRepository } from "../domain/token-repository";

export class GenerateToken {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(): Promise<{ id: string; code: string; createdAt: Date }> {
    // 8-digit numeric code; pad to ensure leading zeros are kept
    const code = Math.floor(Math.random() * 1_0000_0000)
      .toString()
      .padStart(8, "0");

    return this.tokenRepository.save(code);
  }
}
