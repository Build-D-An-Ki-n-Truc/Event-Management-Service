import { Types } from "mongoose";
import { IsDate  } from 'class-validator';
import { Type } from 'class-transformer';
import { VoucherStatus } from "../Schemas/vouchers.schema";


export class EditVoucherDTO {
    event_id: Types.ObjectId;
    _id: Types.ObjectId;
    online: boolean = true;
    qr_code: string;
    value: number = 0;
    description: string;
    status: VoucherStatus

    @IsDate()
    @Type(() => Date)
    expiration_date: Date;
}