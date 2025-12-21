import { Client, Genero, TipoDocumento } from "../../entities/client";

export interface RegisterClientUseCase {
  execute(input: {
    nombres: string;
    apellidos: string;
    tipo_documento: TipoDocumento;
    nro_documento: string;
    fecha_nacimiento: string;
    bono_bienvenida: boolean;
    departamento: string;
    provincia: string;
    distrito: string;
    codigo_celular: string;
    numero_celular: string;
    genero: Genero;
    token_code: string;
  }): Promise<Client>;
}
