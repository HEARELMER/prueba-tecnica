import { v4 as uuid } from "uuid";

export enum TipoDocumento {
  DNI = "DNI",
  CE = "CE",
}

export interface ClientProps {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  nroDocumento: string;
  fechaNacimiento: Date;
  bonoBienvenida: boolean;
  departamento: string;
  provincia: string;
  distrito: string;
  codigoCelular: string;
  numeroCelular: string;
  correoElectronico: string;
  genero: Genero;
  createdAt: Date;
}

export enum Genero {
  MASCULINO = "M",
  FEMENINO = "F",
  OTRO = "O",
}

export class Client {
  private constructor(private readonly props: ClientProps) {}

  static create(input: {
    nombres: string;
    apellidos: string;
    tipoDocumento: TipoDocumento;
    nroDocumento: string;
    fechaNacimiento: Date;
    bonoBienvenida: boolean;
    departamento: string;
    provincia: string;
    distrito: string;
    codigoCelular: string;
    numeroCelular: string;
    correoElectronico: string;
    genero: Genero;
  }): Client {
    const age = calculateAge(input.fechaNacimiento);
    if (age < 18) {
      throw new Error("El cliente debe ser mayor de 18 años");
    }

    const now = new Date();
    return new Client({
      id: uuid(),
      nombres: input.nombres,
      apellidos: input.apellidos,
      tipoDocumento: input.tipoDocumento,
      nroDocumento: input.nroDocumento,
      fechaNacimiento: input.fechaNacimiento,
      bonoBienvenida: input.bonoBienvenida,
      departamento: input.departamento,
      provincia: input.provincia,
      distrito: input.distrito,
      codigoCelular: input.codigoCelular,
      numeroCelular: input.numeroCelular,
      correoElectronico: input.correoElectronico,
      genero: input.genero,
      createdAt: now,
    });
  }

  static fromPrimitives(props: ClientProps): Client {
    return new Client({ ...props });
  }

  toPrimitives(): ClientProps {
    return { ...this.props };
  }
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age;
}
