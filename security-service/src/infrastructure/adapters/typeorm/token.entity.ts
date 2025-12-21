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

  @Column({ name: "token_code", type: "char", length: 8, unique: true })
  tokenCode!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;
}
