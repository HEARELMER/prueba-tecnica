import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { GenerateTokenUseCase } from "../../../domain/ports/in/generate-token.use-case";
import { ValidateTokenUseCase } from "../../../domain/ports/in/validate-token.use-case";

// Class-based HTTP adapter (Nest-like style)
export class ApiRoutes {
  constructor(
    private readonly generateToken: GenerateTokenUseCase,
    private readonly validateToken: ValidateTokenUseCase
  ) {}

  register(server: Server): void {
    server.route({
      method: "POST",
      path: "/generate",
      handler: async (_request: Request, h: ResponseToolkit) => {
        const token = await this.generateToken.execute();
        return h.response(token).code(201);
      },
    });

    server.route({
      method: "POST",
      path: "/validate",
      handler: async (request: Request, h: ResponseToolkit) => {
        const payload = request.payload as {
          code?: unknown;
          token_code?: unknown;
        };
        const code =
          typeof payload?.token_code === "string"
            ? payload.token_code
            : payload?.code;

        if (typeof code !== "string" || !/^[0-9]{8}$/.test(code)) {
          return h
            .response({ message: "code must be an 8-digit numeric string" })
            .code(400);
        }

        const isValid = await this.validateToken.execute(code);
        return h.response({ valid: isValid }).code(isValid ? 200 : 404);
      },
    });

    server.route({
      method: "GET",
      path: "/status",
      handler: (_request: Request, h: ResponseToolkit) => {
        return h.response({ status: "ok" }).code(200);
      },
    });
  }
}
