import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn} from "typeorm";
import { Event } from "./event";

@Entity()
export class Category extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany(() => Event, event => event.category)
    events!: Event[];

    @CreateDateColumn({ name: "createdAt" })
    createdAt!: Date;
}