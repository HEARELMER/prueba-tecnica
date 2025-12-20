import { Server, Request, ResponseToolkit } from "@hapi/hapi";

export const registerRoutes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/health",
    handler: (_request: Request, h: ResponseToolkit) =>
      h.response({ status: "ok" }),
  });
};
