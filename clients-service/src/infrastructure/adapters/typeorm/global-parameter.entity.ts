import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "global_parameters" })
export class GlobalParameterEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "param_key", type: "varchar", length: 120, unique: true })
  paramKey!: string;

  @Column({ name: "param_value", type: "varchar", length: 255 })
  paramValue!: string;
}
