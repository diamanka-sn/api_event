import { Repository } from "typeorm";
import { AbstractService } from "./AbstarctService";
import { Category } from "../models/category";

export class CategoryService extends AbstractService<Category> {
    constructor(repository: Repository<Category>) {
        super(repository);
    }

    async findOrCreateCategory(name: string): Promise<Category> {
        let category = await this.getByFilter({ name:  name });
        if (!category) {
            category = await this.create({ name:name });
        }
        return category;
    }
}