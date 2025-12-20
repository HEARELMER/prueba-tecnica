export interface SecurityGateway {
  validate(code: string): Promise<boolean>;
}
