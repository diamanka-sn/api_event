import { Repository } from "typeorm";
import { AbstractService } from "./AbstarctService";
import { Event } from "../models/event";
import { User } from "../models/user";
import { AppDataSource } from "../data-source";
import { UserEvent } from "../models/userEvent";

export class EventService extends AbstractService<Event> {
    constructor(repository: Repository<Event>) {
        super(repository);
    }

    async getParticipants(eventId: number): Promise<User[]> {
        const event = await this.getById({ id: eventId });
        if (!event) {
            throw new Error('Event not found');
        }
        const userRepository = AppDataSource.getRepository(UserEvent);
        const userEvents = await userRepository.find({ where: { event: { id: eventId } }, relations: ['user'] });
        console.log(userEvents)
        const participants = userEvents.map(userEvent => userEvent.user);
    
        return participants;
    }

    async countParticipants(eventId: number): Promise<number> {
        const participants = await this.getParticipants(eventId);
        return participants.length;
    }

    async countParticipantsByCategory(userId:number): Promise<{ [key: string]: number }> {
        const events = await this.repository.find({ where: { user: { id: userId } }, relations: ['category', 'userEvents'] });
        const categoryCounts: { [key: string]: number } = {};

        events.forEach(event => {
            const categoryName = event.category.name;
            const participantCount = event.userEvents.length;

            if (!categoryCounts[categoryName]) {
                categoryCounts[categoryName] = 0;
            }
            categoryCounts[categoryName] += participantCount;
        });

        return categoryCounts;
    }
}