import { TokenRepositoryPort } from "../../domain/ports/out/token-repository.port";
import { ValidateTokenUseCase } from "../../domain/ports/in/validate-token.use-case";

export class ValidateToken implements ValidateTokenUseCase {
  constructor(private readonly tokenRepository: TokenRepositoryPort) {}

  async execute(code: string): Promise<boolean> {
    if (!/^[0-9]{8}$/.test(code)) {
      return false;
    }

    const token = await this.tokenRepository.findByCode(code);
    return Boolean(token && token.isActive);
  }
}
