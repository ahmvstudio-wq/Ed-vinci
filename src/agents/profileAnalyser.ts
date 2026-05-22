import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { NormalisedAnswers, ActivationProfile } from '../types/user';
import { profileAnalyserPrompt } from '../prompts/profileAnalyser.prompt';

function validateActivationProfile(obj: unknown): Pick<ActivationProfile, 'themes' | 'profileSummary'> {
  const r = obj as Record<string, any>;
  if (!r.themes || typeof r.themes !== 'object') {
    throw new Error(`ProfileAnalyser returned incomplete JSON: ${JSON.stringify(r).substring(0, 200)}`);
  }
  const t = r.themes as Record<string, any>;
  // Ensure array fields exist with fallbacks
  if (!Array.isArray(t.skills)) t.skills = [];
  if (!Array.isArray(t.interests)) t.interests = [];
  if (!Array.isArray(t.resistances)) t.resistances = [];
  return r as Pick<ActivationProfile, 'themes' | 'profileSummary'>;
}

export async function runProfileAnalyser(answers: NormalisedAnswers): Promise<ActivationProfile> {
  logger.info('[AGENT_START]', { agent: 'profileAnalyser', sessionId: answers.sessionId });

  const systemPrompt = profileAnalyserPrompt();
  const userMessage = JSON.stringify({
    answers: answers.normalisedAnswers || answers,
    refinedSignal: answers.refinedSignal
  });

  const result = await withRetry(
    async () => {
      const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 32000, temperature: 0.2 });
      logger.debug('[LLM_RAW]', { agent: 'profileAnalyser', raw: rawText });
      const parsed = parseJSON<unknown>(rawText);
      const validated = validateActivationProfile(parsed);
      
      return {
        ...answers,
        themes: validated.themes,
        profileSummary: validated.profileSummary
      };
    },
    3,
    'profileAnalyser'
  );

  logger.info('[AGENT_DONE]', { agent: 'profileAnalyser', sessionId: answers.sessionId });
  return result;
}
