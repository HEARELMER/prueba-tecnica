export type DocumentType = 'DNI' | 'CE';

export interface SecurityToken {
  id: string;
  tokenCode: string;
  createdAt: string;
  isActive: boolean;
}

export interface RegisterClientRequest {
  nombres: string;
  apellidos: string;
  tipo_documento: DocumentType;
  nro_documento: string;
  fecha_nacimiento: string; // ISO date string YYYY-MM-DD
  bono_bienvenida: boolean;
  token_code: string;
}

export interface RegisterClientResponse {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: DocumentType;
  nroDocumento: string;
  fechaNacimiento: string;
  bonoBienvenida: boolean;
  createdAt: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
}
