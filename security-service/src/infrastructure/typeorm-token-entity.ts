import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "tokens" })
export class TokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 8, unique: true })
  code!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
