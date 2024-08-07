import { FindOptionsWhere, In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Group } from "../models/group";
import { Message } from "../models/message";
import { MessageService } from "../services/messageService";

export class MessageController {
  private messageService!: MessageService;
  

  constructor() {
    AppDataSource.initialize()
            .then(async () => {
                this.messageService = new MessageService(AppDataSource.getRepository(Message));
            })
            .catch((error) => console.log(error));

            
  }

  async sendMessage(req: any, res: any){
    const { senderId, receiverId, content,groupId } = req.body;
    try {
      const group = await AppDataSource.getRepository(Group).findOneBy({id: groupId})
      const messageToSend = new Message();
      messageToSend.senderId = senderId;
      messageToSend.receiverId = receiverId;
      messageToSend.content = content;
      messageToSend.groupId = group?.id ?? 0;

      const message = await this.messageService.create(messageToSend);
      res.status(201).json(message);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getMessages(req: any, res: any) {
    try {
      const { senderId, receiverId } = req.params;
      console.log('====================================');
      console.log('senderId:', senderId, 'receiverId:', receiverId);
      console.log('====================================');
  
      // Création de conditions dynamiques pour éviter les doublons
      const conditions: FindOptionsWhere<Message>[] = [
        { senderId: Number(senderId), receiverId: Number(receiverId) },
        { senderId: Number(receiverId), receiverId: Number(senderId) },
      ];
  
      const messages = await this.messageService.getAllMessage(
        conditions
      );
  
      res.status(200).json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  
  
  

  

}