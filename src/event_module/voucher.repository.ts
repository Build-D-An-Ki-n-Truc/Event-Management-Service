import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { VoucherDocument, Voucher } from "./Schemas/vouchers.schema";

@Injectable()
export class VouchersRepository {
    constructor(@InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument> ) {}


    async findOne(filterQuery: FilterQuery<Voucher>): Promise<Voucher> {
        return this.voucherModel.findOne(filterQuery)
    }

    async find(filterQuery: FilterQuery<Voucher>): Promise<Voucher[]> {
        return this.voucherModel.find(filterQuery)
    }

    async create(voucher: Voucher): Promise<Voucher> {
        const new_brand = new this.voucherModel(voucher);
        return new_brand.save();
    }

    async findOneAndUpdate(filterQuery: FilterQuery<Voucher>, voucher: Partial<Voucher>): Promise<Voucher> {
        return this.voucherModel.findOneAndUpdate(filterQuery, voucher, {new: true});
    }
}