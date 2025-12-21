import { Repository } from "typeorm";
import { Client, ClientProps } from "../../../domain/entities/client";
import { ClientRepositoryPort } from "../../../domain/ports/out/client-repository.port";
import { ClientEntity } from "./client.entity";

export class TypeOrmClientRepository implements ClientRepositoryPort {
  constructor(private readonly repo: Repository<ClientEntity>) {}

  async save(client: Client): Promise<Client> {
    const data = client.toPrimitives();
    const entity = this.repo.create({
      id: data.id,
      nombres: data.nombres,
      apellidos: data.apellidos,
      tipoDocumento: data.tipoDocumento,
      nroDocumento: data.nroDocumento,
      fechaNacimiento: data.fechaNacimiento,
      bonoBienvenida: data.bonoBienvenida,
      departamento: data.departamento,
      provincia: data.provincia,
      distrito: data.distrito,
      codigoCelular: data.codigoCelular,
      numeroCelular: data.numeroCelular,
      genero: data.genero,
      createdAt: data.createdAt,
    });

    const saved = await this.repo.save(entity);
    return Client.fromPrimitives(mapToProps(saved));
  }
}

function mapToProps(entity: ClientEntity): ClientProps {
  return {
    id: entity.id,
    nombres: entity.nombres,
    apellidos: entity.apellidos,
    tipoDocumento: entity.tipoDocumento,
    nroDocumento: entity.nroDocumento,
    fechaNacimiento: entity.fechaNacimiento,
    bonoBienvenida: entity.bonoBienvenida,
    departamento: entity.departamento,
    provincia: entity.provincia,
    distrito: entity.distrito,
    codigoCelular: entity.codigoCelular,
    numeroCelular: entity.numeroCelular,
    genero: entity.genero,
    createdAt: entity.createdAt,
  };
}
