import { Repository } from "typeorm";
import { Group } from "../models/group";
import { AbstractService } from "./AbstarctService";

export class GroupService extends AbstractService<Group>{

    constructor(repository: Repository<Group>){
        super(repository);
    }

    async findOneBySenderIdAndReceivedId(senderId: number, receivedId: number): Promise<Group | undefined> {
        const groups = await this.repository.find({
            where: {},
            relations: ['members']
        });

        const group = groups.find(g => g.members.some(m => m.id === senderId) && g.members.some(m => m.id === receivedId));

        return group;
    }
        

}