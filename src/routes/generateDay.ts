import { Router } from 'express';
import { runDayPromptGenerator } from '../agents/dayPromptGenerator';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/generate-day
 * 
 * Body:
 * {
 *   day: number,                    // which day to generate (1-30)
 *   previousDaySubmission: string | null,  // what the user submitted yesterday
 *   identity: IdentityResult,
 *   stack: StackResult,
 *   builderType: string,
 *   goal: string
 * }
 */
router.post('/generate-day', async (req, res) => {
  const { day, previousDaySubmission, identity, stack, builderType, goal } = req.body;

  if (!day || !identity || !stack) {
    return res.status(400).json({ error: 'Missing required fields: day, identity, stack' });
  }

  if (day < 1 || day > 30) {
    return res.status(400).json({ error: 'Day must be between 1 and 30' });
  }

  logger.info('[ROUTE] generate-day', { day, builderType });

  try {
    const prompt = await runDayPromptGenerator(
      day,
      identity,
      stack,
      builderType || 'fixer',
      goal || '30-day AI builder challenge',
      previousDaySubmission || null
    );

    return res.json({ success: true, prompt });
  } catch (err: any) {
    logger.error('[ROUTE] generate-day failed', { day, error: err.message });
    return res.status(500).json({ error: err.message });
  }
});

export default router;
