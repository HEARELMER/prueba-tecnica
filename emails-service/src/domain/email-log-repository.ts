export interface EmailLogRepository {
  save(entry: {
    clientId: string;
    email: string;
    status: "queued" | "sent" | "failed";
    payload: string;
  }): Promise<{
    id: string;
    clientId: string;
    email: string;
    status: "queued" | "sent" | "failed";
    payload: string;
    createdAt: Date;
  }>;
}
