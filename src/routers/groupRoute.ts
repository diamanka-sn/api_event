import express, { Router } from "express";
import { GroupController } from "../controllers/groupController";

export class GroupRoutes {
    public router: Router;
    private groupController: GroupController
    constructor() {
        this.router = express.Router()
        this.groupController = new GroupController()
        this.configRoutes();
    }

    private configRoutes() {
        this.router.post('/', this.groupController.createGroup.bind(this.groupController));
        this.router.get('/:userId', this.groupController.findRelatedUsersByGroupId.bind(this.groupController));
        this.router.get('/group/:groupId', this.groupController.findChat.bind(this.groupController));
    }
}