import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genero, TipoDocumento } from "../../../domain/entities/client";

@Entity({ name: "clients" })
export class ClientEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  nombres!: string;

  @Column({ type: "varchar", length: 150 })
  apellidos!: string;

  @Column({
    type: "enum",
    enum: TipoDocumento,
    name: "tipo_documento",
  })
  tipoDocumento!: TipoDocumento;

  @Column({ name: "nro_documento", type: "varchar", length: 20, unique: true })
  nroDocumento!: string;

  @Column({ name: "fecha_nacimiento", type: "date" })
  fechaNacimiento!: Date;

  @Column({ name: "bono_bienvenida", type: "boolean", default: false })
  bonoBienvenida!: boolean;

  @Column({ type: "varchar", length: 120 })
  departamento!: string;

  @Column({ type: "varchar", length: 120 })
  provincia!: string;

  @Column({ type: "varchar", length: 120 })
  distrito!: string;

  @Column({ name: "codigo_celular", type: "varchar", length: 8 })
  codigoCelular!: string;

  @Column({ name: "numero_celular", type: "varchar", length: 20 })
  numeroCelular!: string;

  @Column({ type: "enum", enum: Genero })
  genero!: Genero;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
