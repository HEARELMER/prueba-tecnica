import { Channel } from "amqplib";
import { EmailPublisherPort } from "../../../domain/ports/out/email-publisher.port";

export class RabbitMqEmailPublisher implements EmailPublisherPort {
  constructor(
    private readonly channel: Channel,
    private readonly queueName: string
  ) {}

  async publish(event: {
    id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    nroDocumento: string;
    fechaNacimiento: string;
    bonoBienvenida: boolean;
    createdAt: string;
  }): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });
    const payload = Buffer.from(JSON.stringify(event));
    this.channel.sendToQueue(this.queueName, payload, { persistent: true });
  }
}
