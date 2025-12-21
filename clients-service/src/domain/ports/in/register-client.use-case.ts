import { Client } from "../../client";
import { TipoDocumento } from "../../client";

export interface RegisterClientUseCase {
  execute(input: {
    nombres: string;
    apellidos: string;
    tipo_documento: TipoDocumento;
    nro_documento: string;
    fecha_nacimiento: string;
    bono_bienvenida: boolean;
    token_code: string;
  }): Promise<Client>;
}
