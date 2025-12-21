import { EMAIL_CONTENT_TYPE, EmailLog } from "../domain/entities/email-log";
import { EmailLogRepositoryPort } from "../domain/ports/out/email-log-repository.port";

export interface ClientRegisteredEvent {
  id: string;
  nombres?: string;
  apellidos?: string;
  tipoDocumento?: string;
  nroDocumento?: string;
  fechaNacimiento?: string;
  bonoBienvenida?: boolean;
  createdAt?: string;
}

export class ProcessEmailRequest {
  constructor(private readonly repository: EmailLogRepositoryPort) {}

  async execute(
    event: ClientRegisteredEvent,
    meta?: { messageId?: string }
  ): Promise<EmailLog> {
    const destinatarioReferencia = buildDestinatario(event);
    const rabbitMessageId = meta?.messageId ?? null;
    const sentAt = new Date();

    try {
      await sendFakeEmail(destinatarioReferencia, event);
      return this.repository.save({
        destinatarioReferencia,
        contenidoTipo: EMAIL_CONTENT_TYPE,
        status: "SENT",
        sentAt,
        rabbitMessageId,
      });
    } catch (error) {
      console.error("Email send failed", error);
      return this.repository.save({
        destinatarioReferencia,
        contenidoTipo: EMAIL_CONTENT_TYPE,
        status: "FAILED",
        sentAt,
        rabbitMessageId,
      });
    }
  }
}

function buildDestinatario(event: ClientRegisteredEvent): string {
  const fullName = [event.nombres, event.apellidos]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fullName.length > 0) return fullName;
  return event.id;
}

async function sendFakeEmail(
  destinatario: string,
  event: ClientRegisteredEvent
): Promise<void> {
  // Simulate an email dispatch; in real life, integrate with an email provider.
  console.info(
    `[emails] Enviando correo de bienvenida a ${destinatario} (cliente ${event.id})`
  );
}
