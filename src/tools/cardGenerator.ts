// Stub for Card Generator (Puppeteer)
import { logger } from '../utils/logger';

export async function generateCard(sessionId: string, identityName: string): Promise<string> {
  logger.info('[CARD_GENERATOR] Stub: Generating PNG card', { sessionId, identityName });
  // Simulated CDN URL
  return `https://cdn.edvinci.ai/cards/${sessionId}.png`;
}
