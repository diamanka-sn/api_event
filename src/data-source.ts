import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./models/user"
import { Event } from "./models/event"
import dotenv from "dotenv";

import { Category } from "./models/category";
import { UserEvent } from "./models/userEvent";
import { Group } from "./models/group";
import { Message } from "./models/message";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST_DB || "localhost",
    port: Number(process.env.PORT_DB) || 3306,
    username: process.env.USER_DB || "root",
    password: process.env.PASSWORD_DB || "",
    database: process.env.DB_NAME || "teranga_event_db",
    synchronize: false,
    logging: false,
    entities: [User,Category, Event, UserEvent,Message,Group ],
    migrations: [],
    subscribers: []
})