import { Token } from "../../entities/token";

export interface GenerateTokenUseCase {
  execute(): Promise<Token>;
}
