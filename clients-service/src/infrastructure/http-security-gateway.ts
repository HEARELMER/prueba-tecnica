import axios, { AxiosInstance } from "axios";
import { SecurityGateway } from "../domain/security-gateway";

export class HttpSecurityGateway implements SecurityGateway {
  constructor(private readonly client: AxiosInstance) {}

  async validate(code: string): Promise<boolean> {
    try {
      const response = await this.client.post("/tokens/validate", { code });
      return response.data?.valid === true;
    } catch (error) {
      // On non-2xx we treat as invalid to keep core logic simple.
      return false;
    }
  }
}
