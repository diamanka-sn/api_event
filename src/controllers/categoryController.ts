import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CategoryService } from "../services/categoryService";

import { Category } from "../models/category";

export class CategoryController {
    private categoryService!: CategoryService;

    constructor() {
        AppDataSource.initialize()
            .then(async () => {
                this.categoryService = new CategoryService(AppDataSource.getRepository(Category));
            })
            .catch((error) => console.log(error));
    }


    async countCategories(req: Request, res: Response) {
        try {
            const categoryCount = await this.categoryService.countCategories({});
            res.json(categoryCount);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const all_categories = await this.categoryService.getAll({})
            res.json(all_categories)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

}


