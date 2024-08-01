import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { EventsRepository } from './event.repository';
import { natsConfig } from 'config/nats.config';
import { Types } from 'mongoose';
import { Event } from './Schemas/event.schema';
import { CreateEventDTO } from './dtos/create-event.dto';

@Injectable()
export class EventModuleService {
    private client: ClientProxy

    constructor(private readonly eventRepository: EventsRepository) {
        this.client = ClientProxyFactory.create(natsConfig)
    }

    async publishMessage(subject: string, message: any) {
        return this.client.emit(subject, message);
    }

    async getEventById(eventId: string): Promise<Event> {
        return this.eventRepository.findOne({ _id: new Types.ObjectId(eventId)})
    }

    async getEventByBrandId(brand_id: string): Promise<Event[]> {
        return this.eventRepository.find({ _id: new Types.ObjectId(brand_id)})
    }

    async createEvent(createEventDTO: CreateEventDTO): Promise<Event> {
        const {  brand_id, event_name, event_image, voucher_quantity, start_date, end_date} = createEventDTO
        return this.eventRepository.create({
            brand_id, event_name, event_image, voucher_quantity, start_date, end_date
        })
    }

    async getEventList(): Promise<Event[]> {
        return this.eventRepository.find({})
    }
}
