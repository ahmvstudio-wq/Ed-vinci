// Stub for Resend integration
import { logger } from '../utils/logger';

export const resend = {
  emails: {
    send: async (options: { from: string; to: string; subject: string; html: string }) => {
      logger.info(`[RESEND] Stub: Sending email to ${options.to}`, { subject: options.subject });
      return { id: 'test-email-id', error: null };
    }
  }
};
