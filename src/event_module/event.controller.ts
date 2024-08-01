import { Controller, HttpStatus } from '@nestjs/common';
import { EventModuleService } from './event.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MessageContextDto } from './dtos/message.dto';
import { CreateEventDTO } from './dtos/create-event.dto';

@Controller('event-module')
export class EventModuleController {
    constructor(private readonly event_service: EventModuleService) {}

    @MessagePattern({
        service: 'event-manage',
        endpoint: 'register',
        method: 'POST'
    })
    async createBrand(@Payload() message: MessageContextDto){
        console.log("Register Event",message.payload)
        if (!message.payload.brand_id || !message.payload.event_name || !message.payload.event_image || !message.payload.voucher_quantity || !message.payload.start_date || !message.payload.end_date) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing params in [brand_id, event_name, event_image, voucher_quantity, start_date, end_date]"
                }
            }
        }
        const event_param = new CreateEventDTO()
        event_param.brand_id = message.payload.brand_id
        event_param.event_name = message.payload.event_name
        event_param.event_image = message.payload.event_image
        event_param.voucher_quantity = message.payload.voucher_quantity
        event_param.start_date = message.payload.start_date
        event_param.end_date = message.payload.end_date
        
        const data = await this.event_service.createEvent(event_param)
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
        // const data = null
        
    }

    // Subscriber
    @EventPattern('some.subject') // Adjust the subject to match your use case
    handleIncomingMessage(data: any) {
        console.log('Received message:', data);
        // Handle the message
    }
}
