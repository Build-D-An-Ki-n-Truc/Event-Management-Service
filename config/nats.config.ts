import { NatsOptions, Transport } from '@nestjs/microservices';
import * as runConfig from 'dotenv';

runConfig.config(); // Read .env file
export const natsConfig: NatsOptions = {
    
    transport: Transport.NATS,
    options: {
        name: "NATS_SERVICE",
        servers: [process.env.NATS_URL || 'nats://nats'],
    },
};
