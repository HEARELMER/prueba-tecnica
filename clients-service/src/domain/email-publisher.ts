export interface EmailPublisher {
  publish(event: {
    clientId: string;
    name: string;
    email: string;
    securityCode: string;
  }): Promise<void>;
}
