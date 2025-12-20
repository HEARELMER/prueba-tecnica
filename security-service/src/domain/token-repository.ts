export interface TokenRepository {
  save(code: string): Promise<{ id: string; code: string; createdAt: Date }>;
  findByCode(
    code: string
  ): Promise<{ id: string; code: string; createdAt: Date } | null>;
}
