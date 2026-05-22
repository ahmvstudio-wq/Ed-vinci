import { Router } from 'express';
import { runOrchestrator } from '../agents/orchestrator';

const router = Router();

router.post('/activate', async (req, res) => {
  try {
    const data = req.body;
    
    // Map Q1-Q8 solely based on Onboarding and Quiz answers
    const q1 = data.q1 || data['build-vision'] || '';
    
    // Combine onboarding blocker detail/project description + feel behind status
    const blockerDetail = data['already_building'] || data['paralysis'] || data['scattered'] || data['urgency'] || '';
    const feelBehind = data['start'] || '';
    const q2 = data.q2 || (blockerDetail || feelBehind ? `Blocker/Details: ${blockerDetail}. Feels behind: ${feelBehind}` : '');
    
    const q3 = data.q3 || data['execution-style'] || '';
    const q4 = data.q4 || data['energy-pick'] || '';
    const q5 = data.q5 || data['time-horizon'] || '';
    const q6 = data.q6 || data['ambition'] || '';
    const q7 = data.q7 || data['learning_style'] || '';
    
    // Combine quiz momentum pattern + onboarding consistency
    const momentum = data['momentum-pattern'] || '';
    const consistency = data['consistency'] || '';
    const q8 = data.q8 || (momentum || consistency ? `Momentum Pattern: ${momentum}. Consistency: ${consistency}` : '');

    const result = await runOrchestrator({
      sessionId: data.sessionId || `sess_${Date.now()}`,
      q1,
      q2,
      q3,
      q4,
      q5,
      q6,
      q7,
      q8,
      submittedAt: new Date().toISOString()
    });
    
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
