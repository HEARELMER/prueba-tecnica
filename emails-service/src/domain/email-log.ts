export interface EmailLog {
  id: string;
  clientId: string;
  email: string;
  status: "queued" | "sent" | "failed";
  payload: string;
  createdAt: Date;
}
