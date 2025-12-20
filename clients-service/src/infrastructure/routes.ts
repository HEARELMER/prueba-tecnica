import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { RegisterClient } from "../application/register-client";

export const registerRoutes = (
  server: Server,
  deps: { registerClient: RegisterClient }
) => {
  // Hapi route handler receives Request (immutable) and h (ResponseToolkit) to build the reply.
  server.route({
    method: "POST",
    path: "/clients",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.payload as {
        name: string;
        email: string;
        securityCode: string;
      };
      const saved = await deps.registerClient.execute({
        name: payload.name,
        email: payload.email,
        securityCode: payload.securityCode,
      });
      return h.response(saved).code(201);
    },
  });
};
