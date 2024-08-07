import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, BeforeInsert } from "typeorm";
import { User } from "./user";
import { Category } from "./category";
import { UserEvent } from "./userEvent";


@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column()
    date!: Date;

    @Column()
    isFree!: boolean;

    @Column()
    location!: string

    @Column("simple-array",  { nullable: true })
    images!: string[]; 

    @Column()
    place!:number

    @Column()
    slug!:string

    @Column("simple-array",{ nullable: true })
    video!: string[]; 

    @CreateDateColumn({ name: "createdAt" })
    createdAt!: Date;

    @ManyToOne(() => User, user => user.events)
    user?: User;

    @ManyToOne(() => Category, category => category.events)
    category!: Category;

    @OneToMany(() => UserEvent, userEvent => userEvent.event)
    userEvents!: UserEvent[];

    @BeforeInsert()
    private generateSlug() {
        this.slug = `${Date.now()}-${this.title.replace(/\s+/g, '-').toLowerCase()}`;
    }
}
