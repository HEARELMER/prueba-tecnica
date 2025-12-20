import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { GenerateToken } from "../application/generate-token";
import { ValidateToken } from "../application/validate-token";

export const registerRoutes = (
  server: Server,
  deps: { generateToken: GenerateToken; validateToken: ValidateToken }
) => {
  // Hapi lifecycle (simplified):
  // 1) Incoming HTTP request is normalized into a Request object.
  // 2) Hapi matches the route and invokes the handler with (request, h).
  // 3) Handler returns a response (value or h.response) that Hapi serializes and sends.
  server.route({
    method: "POST",
    path: "/tokens",
    handler: async (_request: Request, h: ResponseToolkit) => {
      const token = await deps.generateToken.execute();
      return h.response(token).code(201);
    },
  });

  server.route({
    method: "POST",
    path: "/tokens/validate",
    handler: async (request: Request, h: ResponseToolkit) => {
      const { code } = request.payload as { code: string };
      const isValid = await deps.validateToken.execute(code);
      return h.response({ valid: isValid }).code(isValid ? 200 : 404);
    },
  });
};
