/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from "../data-source";
import { Response } from "express";
import { AuthRequest } from "../utils/type";
import { UserEventService } from "../services/userEventService";
import { UserEvent } from "../models/userEvent";
import { Event } from "../models/event";
export class UserEventController {
    private userEventService!: UserEventService;

    constructor() {
        AppDataSource.initialize()
            .then(async () => {
                this.userEventService = new UserEventService(AppDataSource.getRepository(UserEvent));
            })
            .catch((error) => console.log(error));
    }

    async registerUserEvent(req: AuthRequest, res: Response) {
        try {
            const eventRepository = AppDataSource.getRepository(Event);

            const event = await eventRepository.findOne({ where: { id: Number(req.params.id) } });
            if (!event) {
                return res.status(401).json({ message: "Evenement n'existe pas." });
            }

            const notRegister = await this.userEventService.notExist({ event: { id: Number(req.params.id) }, user: { id: req.userId } });

            if (!notRegister) {
                return res.status(401).json({ message: "Vous etes déjà inscrit à cet evenement." });
            }

          const u =   await this.userEventService.create({ event: { id: Number(req.params.id) }, user: { id: req.userId } });


            const userEvent = await this.userEventService.getWithRelations(
                { event: { id: Number(req.params.id) }, user: { id: req.userId } },
                ['user', 'event']
            );

            if (!userEvent) {
                return res.status(401).json({ message: "Utilisateur n'existe pas." });
            }

         await this.userEventService.notifyUserEventSubscription(userEvent.user, userEvent.event);

            res.json(u);
        } catch (error: any) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    }


    async getAllPagination1(req: Request, res: Response): Promise<void> {
        try {
            // const page = parseInt(req.query.page as string, 10) || 1;
            // const limit = parseInt(req.query.limit as string, 10) || 10;

            const liste_events = await this.userEventService.getAllPaginate({}, ["category", "user", "userEvents"], 1, 10);

            res.status(200).json(liste_events);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

}