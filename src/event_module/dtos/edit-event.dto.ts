import { Types } from "mongoose";
import { IsDate  } from 'class-validator';
import { Type } from 'class-transformer';

export class EditEventDTO {
    brand_id: Types.ObjectId
    _id: Types.ObjectId;
    event_name: string;
    event_image: string;
    description: string;
    voucher_quantity: number = 0;
    voucher_condition: Record<string, any>;

    @IsDate()
    @Type(() => Date)
    start_date: Date;
    
    @IsDate()
    @Type(() => Date)
    end_date: Date
}