import { Repository } from "typeorm";
import { Message } from "../models/message";
import { AbstractService } from "./AbstarctService";

export class MessageService extends AbstractService<Message> {
  constructor(repository: Repository<Message>) {
    super(repository);
  }
  

}