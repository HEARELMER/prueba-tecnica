export interface GlobalParameterRepositoryPort {
  findValue(paramKey: string): Promise<string | null>;
  findAll(): Promise<{ key: string; value: string }[]>;
  upsert(paramKey: string, paramValue: string): Promise<void>;
}
