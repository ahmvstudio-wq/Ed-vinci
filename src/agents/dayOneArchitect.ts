import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { ActivationProfile } from '../types/user';
import { IdentityResult, StackResult, DayOnePlan } from '../types/identity';
import { dayOneArchitectPrompt } from '../prompts/dayOneArchitect.prompt';

const PLACEHOLDER_DOMAINS = ['yourtool.com', 'example.com', 'yourdomain.com', 'placeholder', 'yourtoolname'];

function hasPlaceholders(obj: Record<string, any>): boolean {
  const str = JSON.stringify(obj).toLowerCase();
  return PLACEHOLDER_DOMAINS.some(d => str.includes(d));
}

const DAY_ONE_FALLBACKS: Record<string, DayOnePlan> = {
  maker: {
    firstProject: 'Create a 5-slide educational carousel about something you know well',
    dayOneAction: 'Open Canva, pick a LinkedIn carousel template, and fill it with content from Claude',
    projectDescription: 'Carousels are the highest-converting format on LinkedIn and Instagram right now. Building one proves you can package knowledge visually in a way people share. This is your first proof of concept.',
    stepByStep: [
      'Open https://claude.ai/new and ask: "Break down [topic you know well] into 5 key insights a beginner needs to understand"',
      "Open https://www.canva.com/ and search 'LinkedIn Carousel Template'",
      'Select a clean, minimal template and duplicate it to create 5 slides',
      "Paste Claude's 5 insights into the slides — one per slide, bold headline + short explanation",
      'Add your name and logo on the final slide',
      'Export as PDF'
    ],
    deliverable: 'A 5-slide PDF carousel you can immediately post on LinkedIn or Instagram',
    exampleUrl: 'https://www.canva.com/learn/linkedin-carousel/'
  },
  explainer: {
    firstProject: "Build a 1-page 'Starter Guide' PDF for a niche topic you know better than most",
    dayOneAction: 'Open Notion, paste your knowledge into an AI block, and structure it as a beginner guide',
    projectDescription: 'Educational PDFs are the highest trust-building assets for knowledge entrepreneurs. This single document positions you as an expert and can be your lead magnet, sold as a $27 product, or shared as a free resource that builds your list.',
    stepByStep: [
      'Open https://www.notion.so/ and create a new page',
      "Title it: 'The Beginner's Guide to [Your Topic]'",
      'Click "+" and select "AI" to generate a draft outline',
      'Edit the outline with your own expertise and examples',
      'Add 5-7 sections with practical tips',
      "Export as PDF using Notion's export feature"
    ],
    deliverable: 'A polished 1-page PDF guide you can share, sell, or use as a lead magnet',
    exampleUrl: 'https://www.notion.so/templates'
  },
  fixer: {
    firstProject: 'Build a live webhook that logs form submissions to a Google Sheet',
    dayOneAction: 'Create a Make.com account and connect your first Webhook to Google Sheets',
    projectDescription: 'This project destroys blank-page paralysis forever. You will prove to yourself that you can connect two unrelated systems on the internet in under 60 minutes. That is the foundational skill of every automation business.',
    stepByStep: [
      'Open https://www.make.com/ and create a free account',
      'Click "Create a new scenario"',
      'Click the "+" and search for "Webhooks" → select "Custom Webhook"',
      'Click "Add" to create a webhook and copy the URL it gives you',
      'Paste that URL in your browser and add "?name=test&email=test@test.com" to the end, press Enter',
      'Back in Make.com, click "OK" — it should show "Successfully determined"',
      'Add a "Google Sheets" module → "Add a Row" and map the name and email fields',
      'Click "Run once" and verify the data appears in your Sheet'
    ],
    deliverable: 'A working Make.com scenario link + a Google Sheet with live test data in it',
    exampleUrl: 'https://community.make.com/'
  }
};

function validateDayOnePlan(obj: unknown, builderType: string): DayOnePlan {
  const r = obj as Record<string, any>;
  if (!r.firstProject || !r.dayOneAction) {
    throw new Error(`DayOneArchitect returned incomplete JSON: ${JSON.stringify(r).substring(0, 200)}`);
  }

  if (hasPlaceholders(r)) {
    logger.warn('[DAY_ONE_ARCHITECT] LLM returned placeholder URLs, applying builderType fallback');
    const base = (DAY_ONE_FALLBACKS[builderType] || DAY_ONE_FALLBACKS['fixer'])!;
    return {
      firstProject: r.firstProject || base.firstProject,
      dayOneAction: r.dayOneAction || base.dayOneAction,
      projectDescription: r.projectDescription || base.projectDescription || '',
      stepByStep: (Array.isArray(r.stepByStep) && r.stepByStep.length > 0 && !hasPlaceholders({ s: r.stepByStep }))
        ? r.stepByStep : (base.stepByStep || []),
      deliverable: r.deliverable || base.deliverable || '',
      exampleUrl: (r.exampleUrl && !PLACEHOLDER_DOMAINS.some(d => r.exampleUrl.toLowerCase().includes(d)))
        ? r.exampleUrl : (base.exampleUrl || '')
    };
  }

  if (!r.projectDescription) r.projectDescription = '';
  if (!Array.isArray(r.stepByStep)) r.stepByStep = [];
  if (!r.deliverable) r.deliverable = '';
  if (!r.exampleUrl) r.exampleUrl = '';
  return r as DayOnePlan;
}

export async function runDayOneArchitect(
  identity: IdentityResult,
  stack: StackResult,
  profile: ActivationProfile
): Promise<DayOnePlan> {
  logger.info('[AGENT_START]', { agent: 'dayOneArchitect', sessionId: profile.sessionId });

  const systemPrompt = dayOneArchitectPrompt(identity, stack, profile);
  const userMessage = JSON.stringify({
    resistances: profile.themes.resistances,
    goal: profile.themes.goal,
    builderType: profile.themes.builderType,
    identity: identity.oneLineIdentity
  });

  const builderType = profile.themes?.builderType || 'fixer';

  try {
    const result = await withRetry(
      async () => {
        const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 1500, temperature: 0.3 });
        logger.debug('[LLM_RAW]', { agent: 'dayOneArchitect', raw: rawText });
        const parsed = parseJSON<unknown>(rawText);
        return validateDayOnePlan(parsed, builderType);
      },
      3,
      'dayOneArchitect'
    );

    logger.info('[AGENT_DONE]', { agent: 'dayOneArchitect', sessionId: profile.sessionId });
    return result;
  } catch (err: any) {
    logger.warn('[DAY_ONE_ARCHITECT] All retries failed, applying full fallback', { error: err.message });
    return (DAY_ONE_FALLBACKS[builderType] || DAY_ONE_FALLBACKS['fixer'])!;
  }
}
