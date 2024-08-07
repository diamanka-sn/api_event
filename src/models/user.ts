import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
} from "typeorm";
import { Event } from "./event";
import { UserEvent } from "./userEvent";
import { Message } from "./message";
import { Group } from "./group";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  imageUrl?:string;

  @Column("simple-array",  { nullable: true })
  preferences!: string[]; 
  
  @Column({ name: "isOrganizer", default: false })
  isOrganizer!: boolean;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @OneToMany(() => Event, event => event.user)
  events!: Event[];

  @OneToMany(() => UserEvent, userEvent => userEvent.user)
  userEvents!: UserEvent[];


  @OneToMany(() => Message, message => message.sender)
  sentMessages!: Message[];

  @OneToMany(() => Message, message => message.receiver)
  receivedMessages!: Message[];

  @ManyToMany(() => Group, group => group.members)
  groups!: Group[];

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = this;
    return rest;
  }
}
