import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { TipoDocumento } from "../../../../domain/entities/client";

export class RegisterClientDto {
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  apellidos!: string;

  @IsEnum(TipoDocumento)
  tipo_documento!: TipoDocumento;

  @IsString()
  @IsNotEmpty()
  nro_documento!: string;

  @IsDateString()
  fecha_nacimiento!: string;

  @IsBoolean()
  bono_bienvenida!: boolean;

  @IsString()
  @IsNotEmpty()
  token_code!: string;
}
