import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { IdentityResult, StackResult, DailyPrompt } from '../types/identity';
import { dayPromptGeneratorPrompt } from '../prompts/dayPromptGenerator.prompt';

const PLACEHOLDER_DOMAINS = ['yourtool.com', 'example.com', 'yourdomain.com', 'placeholder'];

function hasPlaceholders(str: string): boolean {
  const lower = (str || '').toLowerCase();
  return PLACEHOLDER_DOMAINS.some(d => lower.includes(d));
}

// Rich per-builderType fallback for a single day
function buildDayFallback(
  day: number,
  builderType: string,
  identity: IdentityResult,
  stack: StackResult,
  previousDaySubmission: string | null
): DailyPrompt {
  const phase =
    day <= 3 ? 'ignition' :
    day <= 7 ? 'traction' :
    day <= 14 ? 'build' :
    day <= 21 ? 'polish' : 'proof';

  const previousRef = previousDaySubmission
    ? `Using what you built yesterday ("${previousDaySubmission.substring(0, 80)}${previousDaySubmission.length > 80 ? '...' : ''}"), `
    : '';

  const fallbacks: Record<string, DailyPrompt> = {
    maker: {
      day,
      title: `Day ${day}: Level Up Your Content System`,
      prompt: `${previousRef}create today's content piece using ${stack.primaryTool} and push it one step further than yesterday.`,
      estimatedMinutes: 45,
      outputType: 'content',
      detailedInstructions: `1. Open ${stack.primaryToolUrl} and log into your account\n2. Open your previous work from Day ${day - 1}${previousDaySubmission ? ' — the one you submitted as your deliverable' : ''}\n3. Open https://claude.ai/new in a second tab\n4. In Claude, type: "You are a high-converting content strategist. I have this existing piece: [paste your Day ${day - 1} deliverable]. Now generate me a Day ${day} upgrade: add one new insight, improve the hook, and make the call-to-action more specific. Format it for LinkedIn carousels."\n5. Copy Claude's output\n6. Back in ${stack.primaryTool}, click 'Create new' and pick a fresh carousel template\n7. Map each of Claude's points to one slide — headline on top, explanation below in smaller text\n8. Check contrast ratios: text must be readable at a glance on mobile (use dark text on light backgrounds or vice versa)\n9. Add a final 'About Me' slide: your name, one line about what you help people do, and your DM or email\n10. Export as PDF\n11. Post it on LinkedIn with this caption template: "[Hook question?]\\n\\nHere's what most people miss: [your core insight]\\n\\nSave this for when you need it. 🔖"\n12. Screenshot the published post`,
      resources: [
        { title: 'Canva LinkedIn Carousel Templates', url: 'https://www.canva.com/templates/?query=linkedin+carousel' },
        { title: 'Claude.ai — Free Tier', url: 'https://claude.ai/new' },
        { title: 'Justin Welsh LinkedIn Content Guide', url: 'https://www.justinwelsh.me/blog/the-simple-guide-to-linkedin' },
        { title: 'Taplio — LinkedIn Analytics', url: 'https://taplio.com/' }
      ],
      deliverable: `A screenshot of your Day ${day} carousel published on LinkedIn, showing the post URL`,
      proTip: `Post at 8-9am Tuesday or Thursday — those are peak LinkedIn windows. Then reply to every comment in the first 30 minutes. The algorithm rewards early engagement heavily.`
    },
    fixer: {
      day,
      title: `Day ${day}: Extend Your Automation Pipeline`,
      prompt: `${previousRef}add one new module to your Make.com scenario that makes it more powerful or closer to a paid product.`,
      estimatedMinutes: 60,
      outputType: 'automation',
      detailedInstructions: `1. Open https://make.com and log into your account\n2. Click 'Scenarios' in the left sidebar\n3. Find the scenario you built on Day ${day - 1} and click it to open\n4. Click the small wrench icon on the last module in your scenario to understand what data it currently outputs\n5. Click the '+' button after your last module to add a new one\n6. For Day ${day}, we're adding an AI enrichment step:\n   - Search for 'OpenAI' in the module picker\n   - Select 'Create a Completion' (GPT-4o-mini is cheapest)\n   - In the 'prompt' field, type: "Given this input: [map your incoming data field], write a professional one-paragraph summary in plain English."\n7. After the OpenAI module, add a 'Google Sheets > Update a Row' module to write the AI summary back to your sheet\n8. Click 'Run once' to test the full flow end-to-end\n9. Fix any errors the log shows (click the red circle on a module to see the exact error)\n10. Once green, click the toggle to set your scenario to 'ON' — it will now run automatically\n11. Copy the scenario's share URL (Settings > Share) for your deliverable\n12. Open a new Google Doc and write 3 sentences: what this scenario does, who would pay for it, and what price you'd charge`,
      resources: [
        { title: 'Make.com Official Docs', url: 'https://www.make.com/en/help/' },
        { title: 'OpenAI API Pricing', url: 'https://openai.com/pricing' },
        { title: 'Make.com Community Forum', url: 'https://community.make.com/' },
        { title: 'Automation Agency Pricing Guide', url: 'https://www.agencymavericks.com/blog/how-to-price-automation-services' }
      ],
      deliverable: `Your Make.com scenario share URL plus a Google Doc with 3 sentences describing the product and price`,
      proTip: `The "who would pay for this" exercise is actually your sales pitch. When you can answer that in one sentence, you're ready to DM your first potential client. Do it today.`
    },
    explainer: {
      day,
      title: `Day ${day}: Build Your Authority Asset`,
      prompt: `${previousRef}create an educational piece that packages your knowledge into something a stranger can consume in under 10 minutes.`,
      estimatedMinutes: 50,
      outputType: 'educational',
      detailedInstructions: `1. Open https://www.notion.so/ and log into your account\n2. Click '+ New Page' in the left sidebar\n3. Title it: "The [Your Topic] Framework: A 10-Minute Guide for [Your Audience]"\n4. Open https://claude.ai/new in a second tab\n5. In Claude, paste: "You are an expert educator. I need to create a beginner-friendly guide on [your topic] for [your target audience]. Here is what I built yesterday: [paste your Day ${day - 1} deliverable or notes]. Generate: 1) A compelling intro paragraph that names the reader's exact pain point, 2) 5 key sections with bold headers and 2-3 practical bullet points each, 3) A 'What to do next' section with 3 specific actions, 4) A call-to-action to DM me for more help."\n6. Paste Claude's output into your Notion page\n7. Read through it carefully and edit anything that doesn't sound like YOU — add your own examples and stories\n8. Add a banner image: type '/image' in Notion, then click 'Upload an image' and use a relevant free image from https://unsplash.com\n9. Click 'Share' → 'Share to web' → toggle to ON → copy the public link\n10. Open https://convertkit.com/ (free tier available) and set up a simple landing page to collect emails in exchange for this guide\n11. Paste your Notion link as the "thank you" redirect URL\n12. Copy both your Notion link and your ConvertKit signup link`,
      resources: [
        { title: 'Notion — Free Tier', url: 'https://www.notion.so/product' },
        { title: 'ConvertKit Free Email Tools', url: 'https://convertkit.com/features/email-marketing' },
        { title: 'Unsplash Free Images', url: 'https://unsplash.com/' },
        { title: 'How to Grow a Niche Newsletter', url: 'https://www.growthhackers.com/articles/the-guide-to-growing-a-newsletter' }
      ],
      deliverable: `Your public Notion guide link AND your ConvertKit signup page link`,
      proTip: `Share the Notion link (not the signup page) in 3 niche-specific online communities today. Warm traffic converts way better than cold. After a few people click, THEN share the signup version.`
    }
  };

  return (fallbacks[builderType] || fallbacks['fixer'])!;
}

export async function runDayPromptGenerator(
  day: number,
  identity: IdentityResult,
  stack: StackResult,
  builderType: string,
  goal: string,
  previousDaySubmission: string | null
): Promise<DailyPrompt> {
  logger.info('[AGENT_START]', { agent: 'dayPromptGenerator', day });

  const systemPrompt = dayPromptGeneratorPrompt(day, identity, stack, builderType, goal, previousDaySubmission);
  const userMessage = `Generate Day ${day}'s task now. Be exhaustively specific. Every step must be actionable without thinking.`;

  try {
    const result = await withRetry(
      async () => {
        const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 4000, temperature: 0.5 });
        logger.debug('[LLM_RAW]', { agent: 'dayPromptGenerator', day, raw: rawText.substring(0, 300) });
        const parsed = parseJSON<DailyPrompt>(rawText);

        // Validate minimum quality
        if (!parsed.title || !parsed.detailedInstructions || parsed.detailedInstructions.length < 200) {
          throw new Error(`Day ${day} instructions too short (${parsed.detailedInstructions?.length || 0} chars) — retrying`);
        }
        if (hasPlaceholders(parsed.detailedInstructions)) {
          throw new Error(`Day ${day} instructions contain placeholder URLs — retrying`);
        }

        // Ensure all fields exist
        return {
          day: parsed.day || day,
          title: parsed.title,
          prompt: parsed.prompt || '',
          estimatedMinutes: parsed.estimatedMinutes || 45,
          outputType: parsed.outputType || 'project',
          detailedInstructions: parsed.detailedInstructions,
          resources: Array.isArray(parsed.resources) ? parsed.resources.filter(r => r.url && !hasPlaceholders(r.url)) : [],
          deliverable: parsed.deliverable || '',
          proTip: parsed.proTip || ''
        } as DailyPrompt;
      },
      3,
      `dayPromptGenerator-day${day}`
    );

    logger.info('[AGENT_DONE]', { agent: 'dayPromptGenerator', day, title: result.title });
    return result;
  } catch (err: any) {
    logger.warn('[DAY_PROMPT_GENERATOR] Retries failed, using builderType fallback', { day, error: err.message });
    return buildDayFallback(day, builderType, identity, stack, previousDaySubmission);
  }
}
