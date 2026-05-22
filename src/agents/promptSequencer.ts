import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { ActivationProfile } from '../types/user';
import { IdentityResult, StackResult, DailyPrompt } from '../types/identity';
import { promptSequencerPrompt } from '../prompts/promptSequencer.prompt';

function validatePrompts(obj: unknown): DailyPrompt[] {
  if (!Array.isArray(obj) || obj.length !== 30) {
    throw new Error(`PromptSequencer returned incomplete JSON or not 30 prompts (got ${Array.isArray(obj) ? obj.length : 'non-array'})`);
  }
  // Ensure all new fields have fallbacks on each prompt
  return (obj as any[]).map((p, idx) => ({
    day: p.day || idx + 1,
    title: p.title || `Day ${idx + 1}`,
    prompt: p.prompt || '',
    estimatedMinutes: p.estimatedMinutes || 30,
    outputType: p.outputType || 'project',
    detailedInstructions: p.detailedInstructions || p.prompt || '',
    resources: Array.isArray(p.resources) ? p.resources : [],
    deliverable: p.deliverable || '',
    proTip: p.proTip || ''
  }));
}

export async function runPromptSequencer(
  identity: IdentityResult,
  stack: StackResult,
  profile: ActivationProfile
): Promise<DailyPrompt[]> {
  logger.info('[AGENT_START]', { agent: 'promptSequencer', sessionId: profile.sessionId });

  const systemPrompt = promptSequencerPrompt(identity, stack, profile);
  const userMessage = "Generate the 30-day sequence now.";

  const result = await withRetry(
    async () => {
      const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 8000, temperature: 0.4 });
      logger.debug('[LLM_RAW]', { agent: 'promptSequencer', raw: rawText.substring(0, 500) });
      const parsed = parseJSON<unknown>(rawText);
      return validatePrompts(parsed);
    },
    3,
    'promptSequencer'
  );

  logger.info('[AGENT_DONE]', { agent: 'promptSequencer', sessionId: profile.sessionId, promptCount: result.length });
  return result;
}
