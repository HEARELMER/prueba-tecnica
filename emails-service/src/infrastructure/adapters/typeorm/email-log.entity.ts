import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "email_logs" })
export class EmailLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "destinatario_referencia", type: "varchar", length: 200 })
  destinatarioReferencia!: string;

  @Column({ name: "contenido_tipo", type: "varchar", length: 50 })
  contenidoTipo!: string;

  @Column({ type: "enum", enum: ["SENT", "FAILED"], default: "SENT" })
  status!: "SENT" | "FAILED";

  @Column({ name: "sent_at", type: "datetime" })
  sentAt!: Date;

  @Column({
    name: "rabbit_message_id",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  rabbitMessageId?: string | null;
}
