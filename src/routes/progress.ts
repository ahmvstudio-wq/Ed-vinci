import { Router } from 'express';

const router = Router();

// In-Memory store to persist session progress during runtime
const progressDb = new Map<string, any>();

// GET /api/progress/:sessionId - Retrieve progress data
router.get('/progress/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  let progress = progressDb.get(sessionId);
  if (!progress) {
    progress = {
      sessionId,
      currentDay: 1,
      completedDays: [],
      submissions: {},
      streak: 0,
      lastCompletedDate: null,
      requestedWSocietyInvite: false
    };
    progressDb.set(sessionId, progress);
  }

  res.json({ success: true, data: progress });
});

// POST /api/progress - Save or update progress data
router.post('/progress', (req, res) => {
  const { 
    sessionId, 
    currentDay, 
    completedDays, 
    submissions, 
    streak, 
    lastCompletedDate, 
    requestedWSocietyInvite 
  } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const existing = progressDb.get(sessionId) || {};
  const progress = {
    sessionId,
    currentDay: currentDay !== undefined ? currentDay : (existing.currentDay || 1),
    completedDays: completedDays !== undefined ? completedDays : (existing.completedDays || []),
    submissions: submissions !== undefined ? submissions : (existing.submissions || {}),
    streak: streak !== undefined ? streak : (existing.streak || 0),
    lastCompletedDate: lastCompletedDate !== undefined ? lastCompletedDate : (existing.lastCompletedDate || null),
    requestedWSocietyInvite: requestedWSocietyInvite !== undefined ? requestedWSocietyInvite : (existing.requestedWSocietyInvite || false)
  };

  progressDb.set(sessionId, progress);
  res.json({ success: true, data: progress });
});

export default router;
