 
import { Client, TipoDocumento } from "../domain/entities/client";
import { RegisterClientUseCase } from "../domain/ports/in/register-client.use-case";
import { ClientRepositoryPort } from "../domain/ports/out/client-repository.port";
import { EmailPublisherPort } from "../domain/ports/out/email-publisher.port";
import { EmailToggleReaderPort } from "../domain/ports/out/email-toggle-reader.port";
import { SecurityGatewayPort } from "../domain/ports/out/security-gateway.port";

interface Input {
  nombres: string;
  apellidos: string;
  tipo_documento: TipoDocumento;
  nro_documento: string;
  fecha_nacimiento: string;
  bono_bienvenida: boolean;
  token_code: string;
}

export class RegisterClient implements RegisterClientUseCase {
  constructor(
    private readonly securityGateway: SecurityGatewayPort,
    private readonly emailToggleReader: EmailToggleReaderPort,
    private readonly publisher: EmailPublisherPort,
    private readonly repository: ClientRepositoryPort
  ) {}

  async execute(input: Input): Promise<Client> {
    const isValid = await this.securityGateway.validateToken(input.token_code);
    if (!isValid) {
      throw new Error("Token inválido");
    }

    const client = Client.create({
      nombres: input.nombres,
      apellidos: input.apellidos,
      tipoDocumento: input.tipo_documento,
      nroDocumento: input.nro_documento,
      fechaNacimiento: new Date(input.fecha_nacimiento),
      bonoBienvenida: input.bono_bienvenida,
    });

    const saved = await this.repository.save(client);

    const toggleOn = await this.emailToggleReader.isEmailSendingEnabled();
    if (toggleOn) {
      const data = saved.toPrimitives();
      await this.publisher.publish({
        id: data.id,
        nombres: data.nombres,
        apellidos: data.apellidos,
        tipoDocumento: data.tipoDocumento,
        nroDocumento: data.nroDocumento,
        fechaNacimiento: data.fechaNacimiento.toISOString(),
        bonoBienvenida: data.bonoBienvenida,
        createdAt: data.createdAt.toISOString(),
      });
    }

    return saved;
  }
}
