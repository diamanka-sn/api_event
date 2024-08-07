/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { EventService } from "../services/eventService";
import { Event } from "../models/event";
import { LessThan, MoreThan } from "typeorm";
import { AuthRequest } from "../utils/type";
import { UserService } from "../services/userService";
import { User } from "../models/user";
import { Category } from "../models/category";
import { CategoryService } from "../services/categoryService";
export class EventController {
    private eventService!: EventService;
    private userService!: UserService;
    private categorieService!: CategoryService
    constructor() {
        AppDataSource.initialize()
            .then(async () => {
                this.eventService = new EventService(AppDataSource.getRepository(Event));
                this.userService = new UserService(AppDataSource.getRepository(User));
                this.categorieService = new CategoryService(AppDataSource.getRepository(Category));
            })
            .catch((error) => console.log(error));
    }

    async getAllPagination(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const liste_events = await this.eventService.getAllPaginate({}, ["category", "user", "userEvents"], page, limit);

            res.status(200).json(liste_events);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEvent(req: AuthRequest, res: Response) {
        try {
            const { title, content, date, isFree, location, category, place } = req.body;

            const cat = await this.categorieService.findOrCreateCategory(category);

            const user = await this.userService.getById({ id: req.userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const event = new Event();
            console.log("1", req.files)
            if (req.files) {
                const files = req.files as Express.Multer.File[];

                const imageUrls = files
                    .filter(file => file.fieldname === 'images')
                    .map(file => file.path);

                if (imageUrls.length > 0) {
                    event.images = imageUrls;
                }
            }

            event.title = title;
            event.content = content;
            event.date = new Date(date);
            event.isFree = isFree;
            event.location = location;
            event.category = cat;
            event.user = user;
            event.place = place

            const savedEvent = await this.eventService.create(event);

            res.status(201).json(savedEvent);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const list_events = await this.eventService.getAllWithCategory({});
            res.json(list_events)
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getFutureEvent(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId
            const list_future_events = await this.eventService.getAllWithCategory({ user: { id: userId }, date: MoreThan(new Date()) })
            res.json(list_future_events)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getPastEvent(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId
            const list_past_events = await this.eventService.getAllWithCategory({ user: { id: userId }, date: LessThan(new Date()) })
            res.json(list_past_events)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async countAllEvents(req: Request, res: Response) {
        try {
            const totalEvents = await this.eventService.countEvents({});
            res.json(totalEvents);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async countFutureEvents(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            const futureEventsCount = await this.eventService.countEvents({
                user: { id: userId },
                date: MoreThan(new Date())
            });
            res.json({ futureEventsCount });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async countOrganizers(req: Request, res: Response) {
        try {
            const organizerCount = await this.userService.getOrganizers({});
            res.json(organizerCount);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async countEventsForOrganizer(req: AuthRequest, res: Response) {
        try {
            const count_event_organizer = await this.eventService.count({ user: { id: req.userId }, date: MoreThan(new Date()) })
            res.json(count_event_organizer)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getEventCategories(req: Request, res: Response) {
        try {
            const list_events = await this.eventService.getAllWithCategory({});
            res.json(list_events)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async getOrganizerEvents(req: AuthRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const liste_events = await this.eventService.getAllPaginate({ user: { id: req.userId } }, ["category", "user", "userEvents"], page, limit);

            res.status(200).json(liste_events);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateOrganizerEvent(req: AuthRequest, res: Response) {
        try {
            const event = await this.eventService.getById({ id: Number(req.params.id) })
            if (event?.user?.id !== req.userId) {
                return res.sendStatus(401)
            }

            const e = req.body
            event!.category = e.category || event!.category
            event!.title = e.title || event!.title
            event!.content = e.content || event!.content
            event!.date = e.date || event!.date
            event!.location = e.location || event!.location
            event!.isFree = e.isFree || event!.isFree

            const updateUser = await this.eventService.update({ id: Number(req.params.id) }, event)
            res.json(updateUser)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async participantListEvent(req: AuthRequest, res: Response) {
        try {
            const eventId = Number(req.params.id);
            const verif = await this.eventService.getById({ user: { id: req.userId }, id: eventId })
            if (!verif) {
                return res.sendStatus(401)
            }
            const participants = await this.eventService.getParticipants(eventId);
            res.json(participants);
        } catch (error: any) {
            console.log(error)
            res.status(400).json({ error: error.message });
        }
    }

    async listeParticipant(req: AuthRequest, res: Response) {
        try {
            const eventId = Number(req.params.id);
            const participants = await this.eventService.getParticipants(eventId);
            res.json(participants);
        } catch (error: any) {
            console.log(error)
            res.status(400).json({ error: error.message });
        }
    }

    async countParticipants(req: AuthRequest, res: Response) {
        try {
            const eventId = Number(req.params.eventId);
            const verif = await this.eventService.getById({ user: { id: req.userId }, id: eventId })
            if (!verif) {
                return res.sendStatus(401)
            }
            const count = await this.eventService.countParticipants(eventId);
            res.json(count);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async countParticipantsByCategory(req: AuthRequest, res: Response) {
        try {
            const categoryCounts = await this.eventService.countParticipantsByCategory(Number(req.userId));
            res.json(categoryCounts);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEventDetails(req: Request, res: Response) {
        try {
            const event = await this.eventService.getWithRelations({ slug: req.params.slug}, ["category", "user", "userEvents"])
            console.log(req.params.slug.trim())
            res.json(event)
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }
}