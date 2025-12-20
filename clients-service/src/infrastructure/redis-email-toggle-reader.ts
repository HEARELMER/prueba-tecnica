import { Redis } from "ioredis";
import { EmailToggleReader } from "../domain/email-toggle-reader";

export class RedisEmailToggleReader implements EmailToggleReader {
  constructor(
    private readonly redis: Redis,
    private readonly key = "feature:email_sending"
  ) {}

  async isEmailSendingEnabled(): Promise<boolean> {
    const flag = await this.redis.get(this.key);
    if (!flag) return true; // default on
    return flag === "1" || flag.toLowerCase() === "true";
  }
}
