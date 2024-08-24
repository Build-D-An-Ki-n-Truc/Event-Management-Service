import { Module } from '@nestjs/common';
import { EventModuleController } from './event.controller';
import { EventModuleService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './Schemas/event.schema';
import { EventsRepository } from './event.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Event.name, schema: EventSchema}])
  ],
  controllers: [EventModuleController],
  providers: [EventModuleService, EventsRepository]
})
export class EventModuleModule {}
