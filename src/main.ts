import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {natsConfig} from '../config/nats.config'
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,natsConfig);
  await app.listen()

  const PORT = process.env.PORT || 3005;
  console.log(`Microservice is running on port ${PORT}`);
  const healthCheck = await NestFactory.create(AppModule);
  await healthCheck.listen(PORT);
}
bootstrap();
