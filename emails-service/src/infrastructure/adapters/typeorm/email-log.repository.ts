import { Repository } from "typeorm";
import {
  EMAIL_CONTENT_TYPE,
  EmailLog,
  EmailLogCreate,
} from "../../../domain/entities/email-log";
import { EmailLogRepositoryPort } from "../../../domain/ports/out/email-log-repository.port";
import { EmailLogEntity } from "./email-log.entity";

export class TypeOrmEmailLogRepository implements EmailLogRepositoryPort {
  constructor(private readonly repo: Repository<EmailLogEntity>) {}

  async save(entry: EmailLogCreate): Promise<EmailLog> {
    const entity = this.repo.create({
      destinatarioReferencia: entry.destinatarioReferencia,
      contenidoTipo: entry.contenidoTipo,
      status: entry.status,
      sentAt: entry.sentAt,
      rabbitMessageId: entry.rabbitMessageId ?? null,
    });

    const saved = await this.repo.save(entity);
    return {
      id: saved.id,
      destinatarioReferencia: saved.destinatarioReferencia,
      contenidoTipo: saved.contenidoTipo as typeof EMAIL_CONTENT_TYPE,
      status: saved.status,
      sentAt: saved.sentAt,
      rabbitMessageId: saved.rabbitMessageId ?? null,
    };
  }
}
