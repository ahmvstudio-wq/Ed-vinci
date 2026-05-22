import { logger } from './logger';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  label: string
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      // Groq rate limit handling
      if (err?.status === 429) {
        const retryAfter = parseInt(err.headers?.['retry-after'] ?? '5', 10);
        logger.warn(`[RATE_LIMIT] ${label} hit 429. Waiting ${retryAfter}s`);
        await new Promise(res => setTimeout(res, retryAfter * 1000));
        // We still count this as an attempt, or we could loop without incrementing attempt. 
        // For now, we follow standard exponential backoff after this sleep if it fails again.
      }

      if (attempt === maxAttempts) throw err;
      
      const delay = Math.pow(2, attempt) * 500; // 1000ms, 2000ms, etc.
      logger.warn(`[RETRY] ${label} attempt ${attempt} failed. Waiting ${delay}ms`, { error: err.message });
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error(`${label} failed after ${maxAttempts} attempts`);
}
