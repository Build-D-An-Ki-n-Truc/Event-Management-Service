import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
// export type UserDocument
export type EventDocument = Event & Document

@Schema({ timestamps: true })
export class Event {
    @Prop({ type: Types.ObjectId, ref: "Brand" })
    brand_id: Types.ObjectId;

    @Prop({ required: true })
    event_name: string;

    @Prop()
    event_image: string;

    @Prop()
    voucher_quantity: number;

    @Prop({ required: true, default: Date.now })
    start_date: Date;

    @Prop({ required: true, default: Date.now })
    end_date: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event)