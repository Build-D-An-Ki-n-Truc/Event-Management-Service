import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModuleModule } from './event_module/event.module';
import * as runConfig from 'dotenv'
import { MongooseModule } from '@nestjs/mongoose';


runConfig.config()
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/demo";
@Module({
  imports: [
    EventModuleModule,
    MongooseModule.forRoot(MONGODB_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
