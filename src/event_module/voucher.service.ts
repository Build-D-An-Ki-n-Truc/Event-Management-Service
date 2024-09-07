import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { VouchersRepository } from './voucher.repository';
import { natsConfig } from 'config/nats.config';
import { Types } from 'mongoose';
import { Voucher } from './Schemas/vouchers.schema';
import { randomUUID } from 'crypto';
import { CreateVoucherDTO } from './dtos/create-voucher.dto';
import { EditVoucherDTO } from './dtos/edit-voucher.dto';

@Injectable()
export class VoucherModuleService {
    private client: ClientProxy

    constructor(private readonly voucherRepository: VouchersRepository) {
        this.client = ClientProxyFactory.create(natsConfig)
    }

    async publishMessage(subject: string, message: any) {
        return this.client.emit(subject, message);
    }

    async getVoucherById(voucherId: string): Promise<Voucher> {
        return this.voucherRepository.findOne({ _id: new Types.ObjectId(voucherId) })
    }

    async getVoucherByIds(voucherIds: Array<string>): Promise<Voucher[]> {
        console.log("Ids: ", voucherIds)
        const converted_voucherids = voucherIds.map(id => {
            return new Types.ObjectId(id);
        })
        return this.voucherRepository.find({ _id: {$in: converted_voucherids} })
    }

    async getVoucherByEventId_Value(value: number, event_id: Types.ObjectId): Promise<Voucher> {
        return this.voucherRepository.findOne({ value, event_id })
    }

    async createVoucher(createVoucherDto: CreateVoucherDTO): Promise<Voucher> {
        const { event_id, online, qr_code, value, description, expiration_date, status } = createVoucherDto
        const voucher_exist = await this.getVoucherByEventId_Value(value, event_id)
        // If exist, return it or create new one
        return voucher_exist ? voucher_exist :this.voucherRepository.create({
            event_id, voucher_code: randomUUID(), qr_code, online, value, description, expiration_date, status
        })
    }

    async editVoucher(editVoucherDTO: EditVoucherDTO): Promise<Voucher> {
        const update_query = {};
        for (const key in editVoucherDTO) {
        if (editVoucherDTO[key] !== undefined) {
            update_query[key] = editVoucherDTO[key];
        }
        }
        const filter_query = { "_id": new Types.ObjectId(editVoucherDTO._id)}
        return this.voucherRepository.findOneAndUpdate(filter_query, update_query)
    }

    async getVoucherList(): Promise<Voucher[]> {
        return this.voucherRepository.find({})
    }
}
