import { Router } from 'express';
import { runSignalRefiner } from '../agents/signalRefiner';
import { logger } from '../utils/logger';

const router = Router();

router.post('/refine', async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'Missing answers' });
  }

  try {
    const refined = await runSignalRefiner(answers);
    res.json({ refined });
  } catch (error: any) {
    logger.error('[REFINE_API_ERROR]', { error: error.message });
    res.status(500).json({ error: 'Failed to refine answer' });
  }
});

export default router;
