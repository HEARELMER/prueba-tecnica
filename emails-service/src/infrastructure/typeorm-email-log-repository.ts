import { Repository } from "typeorm";
import { EmailLogRepository } from "../domain/email-log-repository";
import { EmailLogEntity } from "./typeorm-email-log-entity";

export class TypeOrmEmailLogRepository implements EmailLogRepository {
  constructor(private readonly repo: Repository<EmailLogEntity>) {}

  async save(entry: {
    clientId: string;
    email: string;
    status: "queued" | "sent" | "failed";
    payload: string;
  }) {
    const saved = await this.repo.save(entry);
    return {
      id: saved.id,
      clientId: saved.clientId,
      email: saved.email,
      status: saved.status,
      payload: saved.payload,
      createdAt: saved.createdAt,
    };
  }
}
