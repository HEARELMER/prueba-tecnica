import { Channel, ChannelModel, ConsumeMessage, connect } from "amqplib";
import { ProcessEmailRequest } from "../../../application/process-email-request";

export class RabbitMqConsumer {
  private connection?: ChannelModel;
  private channel?: Channel;
  private reconnectTimer?: NodeJS.Timeout;
  private stopping = false;

  constructor(
    private readonly uri: string,
    private readonly queueName: string,
    private readonly processEmail: ProcessEmailRequest
  ) {}

  async start(): Promise<void> {
    this.stopping = false;
    await this.connectAndConsume(0);
  }

  async stop(): Promise<void> {
    this.stopping = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  private async connectAndConsume(retry: number): Promise<void> {
    if (this.stopping) return;
    try {
      const connection = await connect(this.uri);
      this.connection = connection;
      connection.on("close", () => this.scheduleReconnect(0));
      connection.on("error", (err) =>
        console.error("RabbitMQ connection error", err)
      );

      const channel = await connection.createChannel();
      this.channel = channel;
      await channel.assertQueue(this.queueName, { durable: true });
      await channel.prefetch(1);

      await channel.consume(
        this.queueName,
        async (msg: ConsumeMessage | null) => {
          if (!msg) return;
          await this.handleMessage(msg);
        },
        { noAck: false }
      );

      console.info(`[emails] Consuming queue ${this.queueName}`);
    } catch (err) {
      const delay = Math.min(30_000, 1_000 * Math.pow(2, retry));
      console.error(
        `RabbitMQ connect attempt ${retry + 1} failed; retrying in ${delay}ms`,
        err
      );
      this.scheduleReconnect(retry + 1, delay);
    }
  }

  private scheduleReconnect(nextRetry: number, delay = 5_000) {
    if (this.stopping) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(
      () => this.connectAndConsume(nextRetry),
      delay
    );
  }

  private async handleMessage(msg: ConsumeMessage): Promise<void> {
    if (!this.channel) return;
    let payload: unknown;
    try {
      payload = JSON.parse(msg.content.toString());
    } catch (parseError) {
      console.error("Invalid message payload, dropping", parseError);
      this.channel.ack(msg);
      return;
    }

    try {
      await this.processEmail.execute(payload as any, {
        messageId: msg.properties.messageId,
      });
      this.channel.ack(msg);
    } catch (error) {
      console.error("Failed to process email message", error);
      this.channel.nack(msg, false, true); // requeue for retry after recovery
    }
  }
}
