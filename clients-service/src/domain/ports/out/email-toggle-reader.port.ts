export interface EmailToggleReaderPort {
  isEmailSendingEnabled(): Promise<boolean>;
}
