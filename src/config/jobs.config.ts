import { BullModule } from "@nestjs/bull";

export default [
    /* BullModule.registerQueue({
        name: 'analysis',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: 10, // Keep the last 10 failed jobs.
            timeout: 1000 * 60 * 60 * 24,
        }
    }), */
]