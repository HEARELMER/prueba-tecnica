import { ClientRepository } from "../domain/client-repository";
import { EmailPublisher } from "../domain/email-publisher";
import { EmailToggleReader } from "../domain/email-toggle-reader";
import { SecurityGateway } from "../domain/security-gateway";

interface Input {
  name: string;
  email: string;
  securityCode: string;
}

export class RegisterClient {
  constructor(
    private readonly securityGateway: SecurityGateway,
    private readonly emailToggleReader: EmailToggleReader,
    private readonly publisher: EmailPublisher,
    private readonly repository: ClientRepository
  ) {}

  async execute(
    input: Input
  ): Promise<{
    id: string;
    name: string;
    email: string;
    securityCode: string;
    createdAt: Date;
  }> {
    const isValid = await this.securityGateway.validate(input.securityCode);
    if (!isValid) {
      throw new Error("Código de seguridad inválido");
    }

    const saved = await repositorySave(this.repository, input);

    const shouldSend = await this.emailToggleReader.isEmailSendingEnabled();
    if (shouldSend) {
      await this.publisher.publish({
        clientId: saved.id,
        name: saved.name,
        email: saved.email,
        securityCode: saved.securityCode,
      });
    }

    return saved;
  }
}

async function repositorySave(
  repo: ClientRepository,
  input: Input
): Promise<{
  id: string;
  name: string;
  email: string;
  securityCode: string;
  createdAt: Date;
}> {
  return repo.save({
    name: input.name,
    email: input.email,
    securityCode: input.securityCode,
  });
}
