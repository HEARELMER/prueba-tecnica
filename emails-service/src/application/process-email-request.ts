import { EmailLogRepository } from "../domain/email-log-repository";

interface EmailEvent {
  clientId: string;
  name: string;
  email: string;
  securityCode: string;
}

export class ProcessEmailRequest {
  constructor(private readonly repository: EmailLogRepository) {}

  async execute(
    event: EmailEvent
  ): Promise<{
    id: string;
    clientId: string;
    email: string;
    status: "queued" | "sent" | "failed";
    payload: string;
    createdAt: Date;
  }> {
    // This use case is intentionally minimal: we only persist the intent to send.
    // A real implementation would integrate with an email provider here.
    const payload = JSON.stringify(event);
    return this.repository.save({
      clientId: event.clientId,
      email: event.email,
      status: "queued",
      payload,
    });
  }
}
