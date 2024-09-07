import { Module } from '@nestjs/common';
import { EventModuleController } from './event.controller';
import { EventModuleService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './Schemas/event.schema';
import { EventsRepository } from './event.repository';
import { VoucherModuleService } from './voucher.service';
import { VouchersRepository } from './voucher.repository';
import { VoucherModuleController } from './voucher.controller';
import { Voucher, VoucherSchema } from './Schemas/vouchers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Event.name, schema: EventSchema},
      {name: Voucher.name, schema: VoucherSchema}
    ])
  ],
  controllers: [EventModuleController, VoucherModuleController],
  providers: [EventModuleService, EventsRepository, VoucherModuleService, VouchersRepository]
})
export class EventModuleModule {}
