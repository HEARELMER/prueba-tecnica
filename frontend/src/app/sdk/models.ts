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
  departamento: string;
  provincia: string;
  distrito: string;
  codigo_celular: string;
  numero_celular: string;
  genero: 'M' | 'F' | 'O';
}

export interface RegisterClientResponse {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: DocumentType;
  nroDocumento: string;
  fechaNacimiento: string;
  bonoBienvenida: boolean;
  departamento: string;
  provincia: string;
  distrito: string;
  codigoCelular: string;
  numeroCelular: string;
  genero: 'M' | 'F' | 'O';
  createdAt: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
}
