import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
// export type UserDocument
export type VoucherDocument = Voucher & Document

export enum VoucherStatus {
    Available = 'Available',
    Expired = 'Expired'
}

@Schema({ timestamps: true })
export class Voucher {
    @Prop({ type: Types.ObjectId, ref: "Event" })
    event_id: Types.ObjectId;

    @Prop({ required: true })
    voucher_code: string;

    @Prop()
    online: boolean;

    @Prop({ required: true})
    qr_code: string;

    @Prop() 
    value: number; 

    @Prop({ required: true, enum: VoucherStatus })
    status: VoucherStatus;

    @Prop({ required: true, default: Date.now })
    expiration_date: Date;

    @Prop()
    description: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher)