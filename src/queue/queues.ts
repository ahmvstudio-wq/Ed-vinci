// Stub for BullMQ Queue Definitions
import { logger } from '../utils/logger';

export const queues = {
  activationPipeline: {
    add: async (jobName: string, data: any) => {
      logger.info(`[QUEUE] Job ${jobName} added`, { sessionId: data.sessionId });
      return { id: 'job-id' };
    }
  }
};
