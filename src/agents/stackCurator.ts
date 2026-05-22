import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { ActivationProfile } from '../types/user';
import { IdentityResult, StackResult } from '../types/identity';
import { stackCuratorPrompt } from '../prompts/stackCurator.prompt';

const PLACEHOLDER_DOMAINS = ['yourtool.com', 'example.com', 'yourdomain.com', 'placeholder', 'yourtoolname', 'tool.com'];

function isPlaceholderUrl(url: string): boolean {
  const lower = (url || '').toLowerCase();
  return PLACEHOLDER_DOMAINS.some(d => lower.includes(d));
}

const STACK_FALLBACKS: Record<string, StackResult> = {
  maker: {
    primaryTool: 'Canva AI',
    primaryReason: 'Provides instant high-fidelity layouts with built-in AI generation — you can produce premium visual content without touching code.',
    primaryToolUrl: 'https://www.canva.com/',
    setupSteps: [
      'Go to https://www.canva.com/ and create a free account',
      'Click "Magic Studio" in the left sidebar',
      'Click "Magic Design" and paste a description of your first content piece',
      'Edit the result and download as PNG or PDF'
    ],
    secondaryTool: 'Claude.ai',
    secondaryToolUrl: 'https://claude.ai/new',
    starterPrompt: 'You are a content strategist. Write me 5 LinkedIn carousel slide titles for a post about [your topic]. Each slide should have a bold hook headline and one key insight.'
  },
  explainer: {
    primaryTool: 'Notion AI',
    primaryReason: 'Lets you organize your knowledge base and generate educational content in the same workspace — perfect for building courses and systems.',
    primaryToolUrl: 'https://www.notion.so/',
    setupSteps: [
      'Go to https://www.notion.so/ and create a free account',
      'Create a new page and click the "+" to add an AI block',
      'Type your first lesson topic and let AI generate the outline',
      'Expand each point manually with your own insight and expertise'
    ],
    secondaryTool: 'Loom',
    secondaryToolUrl: 'https://www.loom.com/',
    starterPrompt: 'Create a structured outline for a 30-minute educational workshop on [your topic]. Include: Learning objectives, 5 key modules with time estimates, 2 interactive exercises, and a clear takeaway action item.'
  },
  fixer: {
    primaryTool: 'Make.com',
    primaryReason: 'Visual logic-tree builder that connects any two apps via API without writing server code — the fastest way to build automation products that clients will pay for.',
    primaryToolUrl: 'https://www.make.com/',
    setupSteps: [
      'Go to https://www.make.com/ and create a free account',
      'Click "Create a new scenario" from your dashboard',
      'Click the large "+" and search for "Webhooks"',
      'Select "Custom Webhook", click "Add", and copy the URL provided'
    ],
    secondaryTool: 'OpenAI API',
    secondaryToolUrl: 'https://platform.openai.com/',
    starterPrompt: 'N/A — Use the Make.com visual builder to connect your first Webhook trigger to a Google Sheets module. The prompt comes after you have the data flowing.'
  }
};

function buildStackFallback(builderType: string, partial: Record<string, any>): StackResult {
  const base = (STACK_FALLBACKS[builderType] || STACK_FALLBACKS['fixer'])!;
  return {
    primaryTool: partial.primaryTool || base.primaryTool,
    primaryReason: partial.primaryReason || base.primaryReason,
    primaryToolUrl: (partial.primaryToolUrl && !isPlaceholderUrl(partial.primaryToolUrl)) ? partial.primaryToolUrl : base.primaryToolUrl,
    setupSteps: (Array.isArray(partial.setupSteps) && partial.setupSteps.length > 0) ? partial.setupSteps : (base.setupSteps || []),
    secondaryTool: partial.secondaryTool || base.secondaryTool || '',
    secondaryToolUrl: (partial.secondaryToolUrl && !isPlaceholderUrl(partial.secondaryToolUrl)) ? partial.secondaryToolUrl : (base.secondaryToolUrl || ''),
    starterPrompt: partial.starterPrompt || base.starterPrompt || ''
  };
}

function validateStackResult(obj: unknown, builderType: string): StackResult {
  const r = obj as Record<string, any>;
  if (!r.primaryTool || !r.primaryReason) {
    throw new Error(`StackCurator returned incomplete JSON: ${JSON.stringify(r).substring(0, 200)}`);
  }
  // Fix any placeholder URLs injected by LLM
  if (isPlaceholderUrl(r.primaryToolUrl || '')) {
    logger.warn('[STACK_CURATOR] LLM injected placeholder URL, applying fallback URLs for builderType:', builderType);
    return buildStackFallback(builderType, r);
  }
  if (!r.primaryToolUrl) r.primaryToolUrl = STACK_FALLBACKS[builderType]?.primaryToolUrl || '';
  if (!Array.isArray(r.setupSteps) || r.setupSteps.length === 0) r.setupSteps = STACK_FALLBACKS[builderType]?.setupSteps || [];
  if (!r.secondaryTool) r.secondaryTool = STACK_FALLBACKS[builderType]?.secondaryTool || '';
  if (!r.secondaryToolUrl) r.secondaryToolUrl = STACK_FALLBACKS[builderType]?.secondaryToolUrl || '';
  if (!r.starterPrompt) r.starterPrompt = STACK_FALLBACKS[builderType]?.starterPrompt || '';
  return r as StackResult;
}

export async function runStackCurator(identity: IdentityResult, builderType: string): Promise<StackResult> {
  logger.info('[AGENT_START]', { agent: 'stackCurator' });

  const systemPrompt = stackCuratorPrompt(identity.archetypeName, builderType);
  const userMessage = `Builder Type: ${builderType}\nArchetype: ${identity.archetypeName}\nIdentity: ${identity.oneLineIdentity}`;

  try {
    const result = await withRetry(
      async () => {
        const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 1200, temperature: 0.2 });
        logger.debug('[LLM_RAW]', { agent: 'stackCurator', raw: rawText });
        const parsed = parseJSON<unknown>(rawText);
        return validateStackResult(parsed, builderType);
      },
      3,
      'stackCurator'
    );

    logger.info('[AGENT_DONE]', { agent: 'stackCurator', primaryTool: result.primaryTool });
    return result;
  } catch (err: any) {
    logger.warn('[STACK_CURATOR] All retries failed, applying full stack fallback', { error: err.message });
    return buildStackFallback(builderType, {});
  }
}
