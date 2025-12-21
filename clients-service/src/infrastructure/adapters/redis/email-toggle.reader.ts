import { Redis } from "ioredis";
import { EmailToggleReaderPort } from "../../../domain/ports/out/email-toggle-reader.port";
import { GlobalParameterRepositoryPort } from "../../../domain/ports/out/global-parameter-repository.port";

export class RedisEmailToggleReader implements EmailToggleReaderPort {
  constructor(
    private readonly redis: Redis,
    private readonly globalParams: GlobalParameterRepositoryPort,
    private readonly key = "ENABLE_EMAIL"
  ) {}

  async isEmailSendingEnabled(): Promise<boolean> {
    const fromRedis = await this.redis.get(this.key);
    if (fromRedis !== null) return isTrue(fromRedis);

    const fromDb = await this.globalParams.findValue(this.key);
    if (fromDb !== null) return isTrue(fromDb);

    return false;
  }
}

function isTrue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1";
}
