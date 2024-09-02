import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { EventDocument, Event } from "./Schemas/event.schema";

@Injectable()
export class EventsRepository {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument> ) {}


    async findOne(filterQuery: FilterQuery<Event>): Promise<Event> {
        return this.eventModel.findOne(filterQuery)
    }

    async find(filterQuery: FilterQuery<Event>): Promise<Event[]> {
        return this.eventModel.find(filterQuery)
    }

    async create(event: Event): Promise<Event> {
        const new_brand = new this.eventModel(event);
        return new_brand.save();
    }

    async findOneAndUpdate(filterQuery: FilterQuery<Event>, event: Partial<Event>): Promise<Event> {
        return this.eventModel.findOneAndUpdate(filterQuery, event, {new: true});
    }
}