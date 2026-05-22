import { Router } from 'express';

const router = Router();

router.get('/card/:sessionId', (req, res) => {
  res.json({ cardUrl: 'https://cdn.edvinci.ai/cards/stub.png' });
});

export default router;
