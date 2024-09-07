import { Controller, HttpStatus } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MessageContextDto } from './dtos/message.dto';
import { VoucherModuleService } from './voucher.service';
import { CreateVoucherDTO } from './dtos/create-voucher.dto';
import { EditVoucherDTO } from './dtos/edit-voucher.dto';

@Controller('event-module')
export class VoucherModuleController {
    constructor(private readonly voucher_service: VoucherModuleService) {}

    @MessagePattern({
        service: 'voucher-manage',
        endpoint: 'register',
        method: 'POST'
    })
    async createVoucher(@Payload() message: MessageContextDto){
        console.log("Register Voucher: ", message.payload);
        if (!message.payload.event_id || !message.payload.qr_code || !message.payload.value || !message.payload.description || !message.payload.expiration_date || !message.payload.status) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing params in [event_id, online, qr_code, value, description, expiration_date, status]"
                }
            }
        }

        const voucher_param = new CreateVoucherDTO();
        voucher_param.event_id = message.payload.event_id;
        voucher_param.qr_code = message.payload.qr_code;
        voucher_param.value = message.payload.value;
        voucher_param.description = message.payload.description;
        voucher_param.expiration_date = message.payload.expiration_date;
        voucher_param.status = message.payload.status;
        
        const data = await this.voucher_service.createVoucher(voucher_param);
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
                    data: "Can't register this voucher"
                }
            }
        }
    }

    @MessagePattern({
        service: 'voucher-manage',
        endpoint: 'edit',
        method: 'PATCH'
    })
    async editVoucher(@Payload() message: MessageContextDto){
        console.log("Edit Voucher: ", message.payload);
        if (!message.payload.event_id || !message.payload._id ) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing params in [event_id, event_id]"
                }
            }
        }

        const voucher_param = new EditVoucherDTO(); 
        voucher_param.event_id = message.payload.event_id;
        voucher_param._id = message.payload._id;
        voucher_param.qr_code = message.payload.qr_code;
        voucher_param.online = message.payload.online;
        voucher_param.value = message.payload.value;
        voucher_param.description = message.payload.description;
        voucher_param.status = message.payload.status;
        voucher_param.expiration_date = message.payload.expiration_date;
        
        console.log(voucher_param)
        const data = await this.voucher_service.editVoucher(voucher_param);
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
                    data: "Can't change this voucher"
                }
            }
        }
    }
    

    @MessagePattern({
        service: 'voucher-manage',
        endpoint: 'voucher_id',
        method: 'GET'
    })
    async getVoucherById(@Payload() message: MessageContextDto) {
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
        const data = await this.voucher_service.getVoucherById(message.params.id)
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }

    @MessagePattern({
        service: 'voucher-manage',
        endpoint: 'voucher_ids',
        method: 'GET'
    })
    async getVoucherByIds(@Payload() message: MessageContextDto) {
        if (!message.params.ids) {
            return {
                payload: {
                    type: ['info'],
                    status: HttpStatus.BAD_REQUEST,
                    data: "Missing param"
                }
            }
        }
        const data = await this.voucher_service.getVoucherByIds(JSON.parse(message.params.ids))
        return {
            payload: {
                type: ['info'],
                status: HttpStatus.OK,
                data: data ? data : "No data"
            }
        }
    }

    @MessagePattern({
        service: 'voucher-manage',
        endpoint: 'all-voucher',
        method: 'GET'
    })
    async getAllEvent() {
        const data = await this.voucher_service.getVoucherList();
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
