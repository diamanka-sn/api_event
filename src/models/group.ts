import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { User } from "./user";

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToMany(() => User, user => user.groups)
  @JoinTable()
  members!: User[];
}