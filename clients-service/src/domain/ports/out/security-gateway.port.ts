export interface SecurityGatewayPort {
  validateToken(tokenCode: string): Promise<boolean>;
}
