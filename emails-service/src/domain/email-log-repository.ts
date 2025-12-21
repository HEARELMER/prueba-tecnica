import { EmailLog, EmailLogCreate } from "./email-log";

export interface EmailLogRepository {
  save(entry: EmailLogCreate): Promise<EmailLog>;
}
