import { Server } from "@hapi/hapi";
import { appDataSource } from "./config/database";
import { env } from "./config/env"; 
import { GenerateToken } from "./application/generate-token/generate-token";
import { ValidateToken } from "./application/validate-token/validate-token"; 
import { ApiRoutes, TokenEntity, TypeOrmTokenRepository } from "./infrastructure/export"; 
 
async function buildServer(): Promise<Server> {
  // Server encapsulates the HTTP listener and plugin system.
  const server = new Server({ port: env.port, host: "localhost" });

  // Initialize DB once during bootstrap to keep handlers lean.
  await appDataSource.initialize();
  const tokenRepo = new TypeOrmTokenRepository(
    appDataSource.getRepository(TokenEntity)
  );

  const generateToken = new GenerateToken(tokenRepo);
  const validateToken = new ValidateToken(tokenRepo);

  const apiRoutes = new ApiRoutes(generateToken, validateToken);
  apiRoutes.register(server);

  // Hapi exposes lifecycle events; here we log when the server is ready.
  server.ext("onPostStart", () => {
    console.info(`[security] Hapi server started at ${server.info.uri}`);
    return undefined;
  });

  return server;
}

async function start() {
  try {
    const server = await buildServer();
    await server.start();
  } catch (err) {
    console.error("Failed to start security service", err);
    process.exit(1);
  }
}

start();
