import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RegisterClientUseCase } from "../../../domain/ports/in/register-client.use-case";
import { RegisterClientDto } from "./dtos/register-client.dto";

export class ApiRoutes {
  constructor(private readonly registerClient: RegisterClientUseCase) {}

  register(server: Server): void {
    server.route({
      method: "POST",
      path: "/clients",
      handler: async (request: Request, h: ResponseToolkit) => {
        const dto = plainToInstance(RegisterClientDto, request.payload, {
          enableImplicitConversion: true,
        });

        const errors = await validate(dto, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
          return h.response({ message: formatError(errors) }).code(400);
        }

        try {
          const saved = await this.registerClient.execute({
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            tipo_documento: dto.tipo_documento,
            nro_documento: dto.nro_documento,
            fecha_nacimiento: dto.fecha_nacimiento,
            bono_bienvenida: dto.bono_bienvenida,
            token_code: dto.token_code,
          });
          return h.response(saved.toPrimitives()).code(201);
        } catch (error: any) {
          const message = error?.message || "Error al registrar cliente";
          return h.response({ message }).code(400);
        }
      },
    });
  }
}

function formatError(errors: any[]): string {
  const first = errors[0];
  if (first?.constraints) {
    const [, value] = Object.entries(first.constraints)[0];
    return String(value);
  }
  return "Validación inválida";
}
