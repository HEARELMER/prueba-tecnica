import { Channel } from "amqplib";
import { EmailPublisher } from "../domain/email-publisher";

export class RabbitMqEmailPublisher implements EmailPublisher {
  constructor(
    private readonly channel: Channel,
    private readonly queueName: string
  ) {}

  async publish(event: {
    clientId: string;
    name: string;
    email: string;
    securityCode: string;
  }): Promise<void> {
    // Channel is injected to keep publisher side-effect free and reusable.
    await this.channel.assertQueue(this.queueName, { durable: true });
    const payload = Buffer.from(JSON.stringify(event));
    this.channel.sendToQueue(this.queueName, payload, { persistent: true });
  }
}
