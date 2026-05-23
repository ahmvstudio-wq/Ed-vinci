import { Router } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// In-memory store for beta phase (no DB yet)
const waitlistEntries: Array<{
  name: string;
  email: string;
  role: string;
  submittedAt: string;
}> = [];

// POST /api/waitlist — save a waitlist signup
router.post('/waitlist', (req, res) => {
  const { name, email, role } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Check for duplicate
  const exists = waitlistEntries.some(e => e.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    // Return success anyway — don't expose whether they're already on the list
    return res.json({ success: true, duplicate: true });
  }

  const entry = {
    name: (name || '').trim(),
    email: email.trim().toLowerCase(),
    role: (role || '').trim(),
    submittedAt: new Date().toISOString(),
  };

  waitlistEntries.push(entry);

  logger.info('[WAITLIST] New signup', {
    name: entry.name,
    email: entry.email,
    role: entry.role,
    total: waitlistEntries.length,
  });

  res.json({ success: true });
});

// GET /api/waitlist/count — public count for social proof
router.get('/waitlist/count', (_req, res) => {
  res.json({ count: waitlistEntries.length });
});

export default router;
