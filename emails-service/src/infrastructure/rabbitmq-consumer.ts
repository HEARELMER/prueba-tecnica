import { Channel, ConsumeMessage } from "amqplib";
import { ProcessEmailRequest } from "../application/process-email-request";

export class RabbitMqConsumer {
  constructor(
    // We receive an already-open channel to avoid mismatched typings between
    // amqplib Connection/Channel in the build step.
    private readonly channel: Channel,
    private readonly queueName: string,
    private readonly processEmail: ProcessEmailRequest
  ) {}

  async start(): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });

    // Each delivered message triggers the use case; ack only after persistence.
    this.channel.consume(this.queueName, async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        await this.processEmail.execute(payload);
        this.channel.ack(msg);
      } catch (error) {
        console.error("Failed to process email message", error);
        this.channel.nack(msg, false, false); // drop or dead-letter in real setup
      }
    });
  }
}
