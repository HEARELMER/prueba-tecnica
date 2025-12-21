export interface ValidateTokenUseCase {
  execute(code: string): Promise<boolean>;
}
