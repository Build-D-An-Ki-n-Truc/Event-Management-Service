import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { EventsRepository } from './event.repository';
import { natsConfig } from 'config/nats.config';
import { Types } from 'mongoose';
import { Event } from './Schemas/event.schema';
import { CreateEventDTO } from './dtos/create-event.dto';
import { EditEventDTO } from './dtos/edit-event.dto';

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
        return this.eventRepository.findOne({ _id: new Types.ObjectId(eventId) })
    }

    async getEventByIds(eventIds: Array<string>): Promise<Event[]> {
        console.log("Ids: ", eventIds)
        const converted_event_ids = eventIds.map(id => {
            return new Types.ObjectId(id);
        })
        return this.eventRepository.find({ _id: {$in: converted_event_ids} })
    }

    async getEventByBrandId_EventName(brand_id: Types.ObjectId, event_name: string): Promise<Event> {
        return this.eventRepository.findOne({ brand_id, event_name })
    }

    async createEvent(createEventDTO: CreateEventDTO): Promise<Event> {
        const { brand_id, event_name, event_image, voucher_quantity, start_date, end_date, description, voucher_condition } = createEventDTO
        const exist_event = await this.getEventByBrandId_EventName(brand_id, event_name)
        // If exist, return it or create new one
        return exist_event ? exist_event :this.eventRepository.create({
            brand_id, event_name, event_image, voucher_quantity, start_date, end_date, description, voucher_condition: voucher_condition ? voucher_condition :{
                shoe: 3,
                book: 4,
                coin: 5
            }
        })
    }

    async editEvent(editEventDTO: EditEventDTO): Promise<Event> {
        const update_query = {};
        for (const key in editEventDTO) {
        if (editEventDTO[key] !== undefined) {
            update_query[key] = editEventDTO[key];
        }
        }
        const filter_query = { "_id": new Types.ObjectId(editEventDTO._id)}
        return this.eventRepository.findOneAndUpdate(filter_query, update_query)
    }

    async getEventList(): Promise<Event[]> {
        return this.eventRepository.find({})
    }
}
