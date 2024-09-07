import { IsDate  } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { VoucherStatus } from '../Schemas/vouchers.schema';

export class CreateVoucherDTO {
    event_id: Types.ObjectId;
    online: boolean = true;
    qr_code: string;
    value: number = 0;
    description: string;
    status: VoucherStatus;
    
    @IsDate()
    @Type(() => Date)
    expiration_date: Date;
}