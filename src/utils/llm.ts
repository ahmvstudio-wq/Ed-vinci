import Groq from 'groq-sdk';
import { env } from '../config/env';
import { logger } from './logger';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function callLLM(
  systemPrompt: string,
  userMessage:  string,
  options?: {
    maxTokens?:   number;
    temperature?: number;
    model?:       string;
  }
): Promise<string> {
  const start = Date.now();

  const response = await groq.chat.completions.create({
    model: options?.model ?? 'llama-3.3-70b-versatile',
    max_tokens: options?.maxTokens ?? 2000,
    temperature: options?.temperature ?? 0, // 0 for structured JSON tasks
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
  });

  const text = response.choices[0]?.message?.content || '';

  logger.info('[LLM]', {
    model: response.model,
    latencyMs: Date.now() - start,
  });

  // Strip any accidental markdown fences
  return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
}

export function parseJSON<T>(raw: string): T {
  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(clean) as T;
}

