import express, { Router } from 'express';
import {CategoryController} from "../controllers/categoryController";

export class CategoryRoutes {
    public router: Router;
    private categoryController: CategoryController;
    constructor() {
        this.router = express.Router()
        this.categoryController = new CategoryController()
        this.configRoutes();
    }

    private configRoutes() {
        this.router.get('/', this.categoryController.getAll.bind(this.categoryController));
        this.router.get('/count', this.categoryController.countCategories.bind(this.categoryController));
    }
}