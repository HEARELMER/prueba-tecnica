import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { Genero, TipoDocumento } from "../../../../domain/entities/client";

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
  departamento!: string;

  @IsString()
  @IsNotEmpty()
  provincia!: string;

  @IsString()
  @IsNotEmpty()
  distrito!: string;

  @IsString()
  @IsNotEmpty()
  codigo_celular!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/^[0-9]+$/)
  numero_celular!: string;

  @IsEnum(Genero)
  genero!: Genero;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  correo_electronico!: string;

  @IsString()
  @IsNotEmpty()
  token_code!: string;
}
