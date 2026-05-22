import { Router } from 'express';

const router = Router();

router.get('/status/:sessionId', (req, res) => {
  res.json({ status: 'completed' });
});

export default router;
