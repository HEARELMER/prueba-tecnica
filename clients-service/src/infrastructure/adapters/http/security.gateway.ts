import { AxiosInstance } from "axios";
import { SecurityGatewayPort } from "../../../domain/ports/out/security-gateway.port";

export class HttpSecurityGateway implements SecurityGatewayPort {
  constructor(private readonly client: AxiosInstance) {}

  async validateToken(tokenCode: string): Promise<boolean> {
    try {
      const response = await this.client.post("/validate", {
        token_code: tokenCode,
      });
      return response.data?.valid === true;
    } catch (_err) {
      return false;
    }
  }
}
