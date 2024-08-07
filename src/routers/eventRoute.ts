import express, { Router } from 'express';
import { EventController } from '../controllers/eventController';

export class EventRoutes {
    public router: Router;
    private eventController: EventController
    constructor() {
        this.router = express.Router()
        this.eventController = new EventController()
        this.configRoutes();
    }

    private configRoutes() {
        this.router.get('/', this.eventController.getAll.bind(this.eventController));
        this.router.get('/all', this.eventController.getAllPagination.bind(this.eventController));
        this.router.get('/:slug', this.eventController.getEventDetails.bind(this.eventController));
        this.router.get('/countOrganizer', this.eventController.countOrganizers.bind(this.eventController));
        
        this.router.get('/count', this.eventController.countAllEvents.bind(this.eventController));
        this.router.get('/counts', this.eventController.getEventCategories.bind(this.eventController));
    }
}
