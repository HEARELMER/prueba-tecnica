export interface EmailToggleReader {
  isEmailSendingEnabled(): Promise<boolean>;
}
