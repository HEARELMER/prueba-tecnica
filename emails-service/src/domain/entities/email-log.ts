export type EmailStatus = "SENT" | "FAILED";

export const EMAIL_CONTENT_TYPE = "BIENVENIDA" as const;

export interface EmailLog {
  id: string;
  destinatarioReferencia: string;
  contenidoTipo: typeof EMAIL_CONTENT_TYPE;
  status: EmailStatus;
  sentAt: Date;
  rabbitMessageId?: string | null;
}

export interface EmailLogCreate {
  destinatarioReferencia: string;
  contenidoTipo: typeof EMAIL_CONTENT_TYPE;
  status: EmailStatus;
  sentAt: Date;
  rabbitMessageId?: string | null;
}
