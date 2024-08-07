import express, { Router } from 'express';
import { UserController } from '../controllers/userController';
import { EventController } from '../controllers/eventController';
import authMiddleware from '../middlewares/authMiddleware';
import { UserEventController } from '../controllers/userEventController';
import organizerMiddleware from '../middlewares/organizerMiddleware';
import { upload, uploadEventImages } from '../middlewares/imageMulter';

export class UserRoutes {
    public router: Router;
    private userController: UserController;
    private eventController: EventController;
    private userEventController: UserEventController
    constructor() {
        this.router = express.Router()
        this.userController = new UserController();
        this.eventController = new EventController()
        this.userEventController = new UserEventController()
        this.configRoutes();
    }

    private configRoutes() {
        this.router.post('/login', this.userController.login.bind(this.userController));
        this.router.post('/register', this.userController.register.bind(this.userController));
        this.router.put('/', authMiddleware, this.userController.updateUser.bind(this.userController));
        this.router.put('/preferences', authMiddleware, this.userController.updateUserPreference.bind(this.userController));
        this.router.post('/upload', authMiddleware, upload.single('file'), this.userController.userImage.bind(this.userController));

        this.router.post('/events', organizerMiddleware,uploadEventImages.array('images', 5),this.eventController.createEvent.bind(this.eventController));

        this.router.get('/events/:id/participants', organizerMiddleware, this.eventController.participantListEvent.bind(this.eventController));
        this.router.get('/events/:id/p', this.eventController.listeParticipant.bind(this.eventController));
        this.router.get('/events/participants/category', organizerMiddleware, this.eventController.countParticipantsByCategory.bind(this.eventController));
        this.router.get('/events/:id/counts', organizerMiddleware, this.eventController.countParticipants.bind(this.eventController));
        this.router.post('/events/:id/register', authMiddleware, this.userEventController.registerUserEvent.bind(this.userEventController));


        this.router.get('/events/my', organizerMiddleware, this.eventController.getOrganizerEvents.bind(this.eventController));
        this.router.put('/events/:id', organizerMiddleware, this.eventController.updateOrganizerEvent.bind(this.eventController));
        this.router.get('/events/future', organizerMiddleware, this.eventController.getFutureEvent.bind(this.eventController));
        this.router.get('/events/past', organizerMiddleware, this.eventController.getPastEvent.bind(this.eventController));
        this.router.get('/events/organizers/count', this.eventController.countOrganizers.bind(this.eventController));
    }
}
