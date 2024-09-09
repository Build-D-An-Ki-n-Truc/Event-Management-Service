import { Controller, HttpStatus } from '@nestjs/common';
import { EventModuleService } from './event.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MessageContextDto } from './dtos/message.dto';
import { CreateEventDTO } from './dtos/create-event.dto';
import { EditEventDTO } from './dtos/edit-event.dto';

@Controller('event-module')
export class EventModuleController {
    constructor(private readonly event_service: EventModuleService) {}

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'register',
        method: 'POST'
    })
    async createEvent(@Payload() message: MessageContextDto){
        console.log("Register Event: ", message.payload);
        if (!message.payload.brand_id || !message.payload.event_name || !message.payload.event_image || !message.payload.voucher_quantity || !message.payload.start_date || !message.payload.end_date) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing params in [brand_id, event_name, event_image, voucher_quantity, start_date, end_date]"
                }
            }
        }

        const event_param = new CreateEventDTO();
        event_param.brand_id = message.payload.brand_id;
        event_param.event_name = message.payload.event_name;
        event_param.event_image = message.payload.event_image;
        event_param.voucher_quantity = message.payload.voucher_quantity;
        event_param.voucher_condition = message.payload.voucher_condition;
        event_param.start_date = message.payload.start_date;
        event_param.end_date = message.payload.end_date;
        
        const data = await this.event_service.createEvent(event_param);
        if (data) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.CREATED,
                    data: data
                }
            }
        } else {
            return {
                payload: {
                    type: ['error'],
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    data: "Can't register this event"
                }
            }
        }
    }

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'edit',
        method: 'PATCH'
    })
    async editEvent(@Payload() message: MessageContextDto){
        console.log("Register Event: ", message.payload);
        if (!message.payload.brand_id || !message.payload._id ) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing params in [brand_id, event_id]"
                }
            }
        }

        const event_param = new EditEventDTO(); 
        event_param.brand_id = message.payload.brand_id;
        event_param._id = message.payload._id;
        event_param.event_name = message.payload.event_name;
        event_param.event_image = message.payload.event_image;
        event_param.voucher_quantity = message.payload.voucher_quantity;
        event_param.voucher_condition = message.payload.voucher_condition;
        event_param.start_date = message.payload.start_date;
        event_param.end_date = message.payload.end_date;
        event_param.description = message.payload.description;
        
        const data = await this.event_service.editEvent(event_param);
        if (data) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.OK,
                    data: data
                }
            }
        } else {
            return {
                payload: {
                    type: ['error'],
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    data: "Can't register this event"
                }
            }
        }
    }
    

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'event_id',
        method: 'GET'
    })
    async getEventById(@Payload() message: MessageContextDto) {
        console.log(message);
        if (!message.params.id) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing param"
                }
            }
        }
        const data = await this.event_service.getEventById(message.params.id)
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'event_by_name',
        method: 'GET'
    })
    async getEventByBrandId_EventName(@Payload() message: MessageContextDto) {
        console.log(message);
        if (!message.params.brand_id || !message.params.event_name) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing param [brand_id, event_name]" 
                }
            }
        }
        const data = await this.event_service.getEventByBrandId_EventName(message.params.brand_id, message.params.event_name)
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'event_ids',
        method: 'GET'
    })
    async getEventIds(@Payload() message: MessageContextDto) {
        if (!message.params.ids) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing param"
                }
            }
        }
        const data = await this.event_service.getEventByIds(JSON.parse(message.params.ids))
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'all-event',
        method: 'GET'
    })
    async getAllEvent() {
        const data = await this.event_service.getEventList();
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }
    // Subscriber
    @EventPattern('some.subject') // Adjust the subject to match your use case
    handleIncomingMessage(data: any) {
        console.log('Received message:', data);
        // Handle the message
    }
}
