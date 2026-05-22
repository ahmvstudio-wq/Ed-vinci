import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { RawAnswers, NormalisedAnswers } from '../types/user';
import { inputProcessorPrompt } from '../prompts/inputProcessor.prompt';

function validateNormalisedAnswers(obj: unknown): any {
  const r = obj as Record<string, any>;
  if (!r.normalisedAnswers || !r.wordCounts) {
    throw new Error(`InputProcessor returned incomplete JSON: ${JSON.stringify(r)}`);
  }
  return r;
}

export async function runInputProcessor(answers: RawAnswers): Promise<NormalisedAnswers> {
  logger.info('[AGENT_START]', { agent: 'inputProcessor', sessionId: answers.sessionId });

  const systemPrompt = inputProcessorPrompt();
  const userMessage = JSON.stringify(answers);

  const result = await withRetry(
    async () => {
      const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 800, temperature: 0 });
      logger.debug('[LLM_RAW]', { agent: 'inputProcessor', raw: rawText });
      const parsed = parseJSON<unknown>(rawText);
      const validated = validateNormalisedAnswers(parsed);
      
      // Merge original answers data
      return {
        ...answers,
        ...validated,
        normalisedAnswers: validated.normalisedAnswers // keep it nested or merge as required by downstream
      };
    },
    3,
    'inputProcessor'
  );

  logger.info('[AGENT_DONE]', { agent: 'inputProcessor', sessionId: answers.sessionId });
  return result;
}
