/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import * as nodemailer from "nodemailer";
import { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
export abstract class AbstractService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async getAll(filter: FindOptionsWhere<T>): Promise<T[]> {
    const list: T[] = await this.repository.find({ where: filter });
    return list;
  }
  async getAllMessage(filters: FindOptionsWhere<T>[]): Promise<T[]> {
    const list: T[] = await this.repository.find({
      where: filters
    });
    return list;
  }
  

  async getAllPaginate(filter: FindOptionsWhere<T>, relations: string[], page: number, limit: number): Promise<{data: T[], total: number}> {
    const [result, total] = await this.repository.findAndCount({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        relations: relations,
    });
  
    return { data: result, total };
}
  async getAllWithCategory(filter: FindOptionsWhere<T>): Promise<T[]> {
    const list: T[] = await this.repository.find({
      where: filter,
      relations: ["category", "user"],
    });
    return list;
  }

  async getAllWith(filter: FindOptionsWhere<T>): Promise<T[]> {
    const list: T[] = await this.repository.find({
      where: filter,
      relations: ["userEvents"],
      
    });
    return list;
  }
  async getAllGroupWith(filter: FindOptionsWhere<T>): Promise<T[]> {
    const list: T[] = await this.repository.find({
      where: filter,
      relations: ["members"],
    });
    return list;
  }
  async getRelations(
    filter: FindOptionsWhere<T>,
    relations: object
  ): Promise<T[]> {
    const list: T[] = await this.repository.find({
      where: filter,
      relations: relations,
    });
    return list;
  }

  async getById(filter: FindOptionsWhere<T>): Promise<T> {
    const data: T | any = await this.repository.findOneBy(filter);
    return data;
  }

  async getOne(filter: FindOptionsWhere<T>,relations: object): Promise<T> {
    const data: T | any = await this.repository.findOne({
      where: filter,
      relations: relations,
    });
    return data;
  }

  async notExist(filter: FindOptionsWhere<T>): Promise<boolean> {
    const data = await this.repository.find({ where: filter });
    return data.length <= 0;
  }

  async getByFilter(filter: FindOptionsWhere<T>): Promise<T | null> {
    const data = await this.repository.findOne({ where: filter });
    return data;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const result = await this.repository.save(data);

    return result;
  }

  async delete(id: number): Promise<T> {
    const result: any = await this.repository.delete(id);
    return result;
  }

  async update(
    filter: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>
  ): Promise<T | null> {
    await this.repository.update(filter, data);
    const result = await this.repository.findOneBy(filter);

    return result;
  }

  async count(filter: FindOptionsWhere<T>): Promise<number> {
    const count = await this.repository.count({ where: filter });
    return count;
  }

  async countEvents(filter: FindOptionsWhere<T>): Promise<number> {
    const events = await this.getAll(filter);
    return events.length;
  }

  async countCategories(filter: FindOptionsWhere<T>): Promise<number> {
    const categories = await this.getAll(filter);
    return categories.length;
  }

  async getOrganizers(filter: FindOptionsWhere<T>): Promise<number> {
    const users = await this.getAll({ ...filter, isOrganizer: 1 });
    return users.length;
  }

  async sendMail(
    from: string,
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    const logoPath = path.join(__dirname, "../logo.jpeg");
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString("base64");
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions: SendMailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: [
        {
          filename: "logo.jpeg",
          content: logoBase64,
          encoding: "base64",
          cid: "logo",
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  async getWithRelations(
    filter: FindOptionsWhere<T>,
    relations: string[]
  ): Promise<T | null> {
    const data: T | null = await this.repository.findOne({
      where: filter,
      relations: relations,
    });
    return data;
  }

  
}
