export interface GlobalParameterRepositoryPort {
  findValue(paramKey: string): Promise<string | null>;
}
