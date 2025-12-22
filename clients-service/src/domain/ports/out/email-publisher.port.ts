export interface EmailPublisherPort {
  publish(event: {
    id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    nroDocumento: string;
    fechaNacimiento: string;
    bonoBienvenida: boolean;
    departamento: string;
    provincia: string;
    distrito: string;
    codigoCelular: string;
    numeroCelular: string;
    genero: string;
    createdAt: string;
    correoElectronico: string;
  }): Promise<void>;
}
