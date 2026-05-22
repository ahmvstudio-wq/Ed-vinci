import { runOrchestrator } from '../src/agents/orchestrator';
import { RawAnswers } from '../src/types/user';

async function test() {
  const exampleInput: RawAnswers = {
    sessionId:  'test-session-123',
    q1: 'Finding problems and fixing them',
    q2: 'I spent 4 hours writing a Python script to organise my messy Google Drive because I hated how it looked.',
    q3: 'Technical stuff - fixing things, building things',
    q4: 'A friend asked me to set up an automated email sequence for their new newsletter.',
    q5: 'Alone - I do my best work solo',
    q6: 'Waking up early, having coffee, and coding for 4 straight hours with no meetings or interruptions.',
    q7: 'I just start and figure it out when I break something',
    q8: 'I tried to learn Next.js. I built a quick landing page, broke the routing, and eventually fixed it by reading the docs.',
    submittedAt: new Date().toISOString()
  };

  try {
    console.log('Running Pipeline Test...');
    const result = await runOrchestrator(exampleInput);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

test();
