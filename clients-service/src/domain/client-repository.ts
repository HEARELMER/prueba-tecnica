export interface ClientRepository {
  save(input: {
    name: string;
    email: string;
    securityCode: string;
  }): Promise<{
    id: string;
    name: string;
    email: string;
    securityCode: string;
    createdAt: Date;
  }>;
}
