
import express from 'express';
import { MessageController } from '../controllers/messageController';

export class MessageRoutes {
  public router: express.Router;
  private messageController: MessageController;

  constructor() {
    this.router = express.Router();
    this.messageController = new MessageController();
    this.configureRoutes();
  }

  private configureRoutes() {
    this.router.post('/', this.messageController.sendMessage.bind(this.messageController));
    this.router.get('/:senderId/:receiverId', this.messageController.getMessages.bind(this.messageController));
    
  }

  
}