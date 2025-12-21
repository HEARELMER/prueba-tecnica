import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumento } from "../../../domain/entities/client";

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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
