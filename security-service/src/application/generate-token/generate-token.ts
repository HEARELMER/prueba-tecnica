import { randomInt } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Token } from "../../domain/entities/token";
import { TokenRepositoryPort } from "../../domain/ports/out/token-repository.port";
import { GenerateTokenUseCase } from "../../domain/ports/in/generate-token.use-case";

export class GenerateToken implements GenerateTokenUseCase {
  constructor(private readonly tokenRepository: TokenRepositoryPort) {}

  async execute(): Promise<Token> { 
    const tokenCode = randomInt(0, 10 ** 8)
      .toString()
      .padStart(8, "0");

    const token: Token = {
      id: uuidv4(),
      tokenCode,
      createdAt: new Date(),
      isActive: true,
    };

    return this.tokenRepository.save(token);
  }
}
