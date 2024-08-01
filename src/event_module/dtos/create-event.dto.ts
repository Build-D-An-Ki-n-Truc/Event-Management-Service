import { Types } from "mongoose";
import { IsDate  } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDTO {
    brand_id: Types.ObjectId;
    event_name: string;
    event_image: string;
    voucher_quantity: number = 0;

    @IsDate()
    @Type(() => Date)
    start_date: Date;
    
    @IsDate()
    @Type(() => Date)
    end_date: Date
}