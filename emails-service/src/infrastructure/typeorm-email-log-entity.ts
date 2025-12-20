import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "email_logs" })
export class EmailLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "client_id", type: "varchar", length: 36 })
  clientId!: string;

  @Column({ type: "varchar", length: 200 })
  email!: string;

  @Column({ type: "varchar", length: 20 })
  status!: "queued" | "sent" | "failed";

  @Column({ type: "text" })
  payload!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
