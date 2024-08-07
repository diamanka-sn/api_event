import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Group } from "../models/group";
import { User } from "../models/user";
import { GroupService } from "../services/groupService";
import { UserService } from "../services/userService";

export class GroupController {
    private groupService!: GroupService;
    private userService!: UserService;
    constructor() {
        AppDataSource.initialize()
        .then(async () => {
            this.groupService = new GroupService(AppDataSource.getRepository(Group));
            this.userService = new UserService(AppDataSource.getRepository(User));
        })
    }

    async createGroup(req: any, res: any) {
        const { senderId, receiverId } = req.body;
        try {
            const group = await this.groupService.findOneBySenderIdAndReceivedId(senderId, receiverId);
            if (group) return res.status(200).json(group);

            const newGroup = new Group();

            const sender = await AppDataSource.getRepository(User).findOneBy({ id: senderId });
            const receiver = await AppDataSource.getRepository(User).findOneBy({ id: receiverId });

            if (!sender || !receiver) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            newGroup.members = [sender, receiver];
            const createdGroup = await this.groupService.create(newGroup);
            res.status(201).json(createdGroup);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async findRelatedUsersByGroupId(req: any, res: any) {
        const { userId } = req.params;
        try {
            // Récupérer les groupes de l'utilisateur connecté
            const userGroups = await this.groupService.getAllGroupWith({
                members: { id: userId }
            });
    
            // Extraire les group_id des groupes de l'utilisateur
            const userGroupIds = userGroups.map(group => group.id);
    
            // Récupérer tous les utilisateurs appartenant aux mêmes groupes
            const relatedUsers = await this.userService.getAll({
                groups: { id: In(userGroupIds) }
            });
    
            // Filtrer les utilisateurs pour exclure l'utilisateur connecté
            const filteredRelatedUsers = relatedUsers.filter(user => user.id !== parseInt(userId));
    
            res.status(200).json(filteredRelatedUsers);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async findChat(req: any, res: any) {
        const { groupId } = req.params;
        try {
            const group = await this.groupService.getRelations(groupId, { relations: ['members'] });
            res.status(200).json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    }
   
}