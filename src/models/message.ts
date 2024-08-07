import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./user";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  content!: string;

  @Column()
  senderId!: number;

  @Column({ nullable: true })
  receiverId!: number;

  @Column({ nullable: true })
  groupId!: number;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: "senderId" })
  sender!: User;

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: "receiverId" })
  receiver!: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  sentAt!: Date;
}