import { callLLM } from '../utils/llm';
import { signalRefinerPrompt } from '../prompts/signalRefiner.prompt';

export async function runSignalRefiner(answers: Record<string, string>): Promise<string> {
  const systemPrompt = signalRefinerPrompt();
  const userMessage = JSON.stringify(answers, null, 2);

  // Use slightly higher maxTokens since it's generating a full profile summary
  const refined = await callLLM(systemPrompt, userMessage, { maxTokens: 400, temperature: 0.3 });
  
  return refined;
}
