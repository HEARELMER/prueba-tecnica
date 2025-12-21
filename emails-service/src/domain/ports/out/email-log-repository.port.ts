import { EmailLog, EmailLogCreate } from "../../entities/email-log";

export interface EmailLogRepositoryPort {
  save(entry: EmailLogCreate): Promise<EmailLog>;
}
