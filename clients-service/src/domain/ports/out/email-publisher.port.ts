export interface EmailPublisherPort {
  publish(event: {
    id: string;
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    nroDocumento: string;
    fechaNacimiento: string;
    bonoBienvenida: boolean;
    createdAt: string;
  }): Promise<void>;
}
