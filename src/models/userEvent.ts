import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Event } from "./event";

@Entity()
export class UserEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.userEvents)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Event, event => event.userEvents)
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;
}