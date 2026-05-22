import { callLLM, parseJSON } from '../utils/llm';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';
import { ActivationProfile } from '../types/user';
import { IdentityResult } from '../types/identity';
import { identityEnginePrompt } from '../prompts/identityEngine.prompt';

const ERROR_PHRASES = [
  'insufficient data',
  'not enough information',
  'cannot determine',
  'unable to determine',
  'no data provided',
  'insufficient information',
  'please provide',
  'i need more'
];

function isLLMCopout(str: string): boolean {
  const lower = (str || '').toLowerCase();
  return ERROR_PHRASES.some(p => lower.includes(p));
}

// Build rich fallback from whatever profile data we have
function buildFallbackFromProfile(profile: ActivationProfile, partial: Record<string, any>): IdentityResult {
  const builderType = profile.themes?.builderType || 'fixer';
  const skillIdentity = profile.themes?.skillIdentity || '';
  const skills = profile.themes?.skills || [];
  const interests = profile.themes?.interests || [];
  const resistances = profile.themes?.resistances || [];
  const goal = profile.themes?.goal || '';

  // Derive reasonable identity from builderType
  let archetype = 'systems_builder';
  let archetypeName = 'Systems Builder';
  let oneLineIdentity = 'Architect of Automated Workflows & AI-Powered Systems';
  let offerType = 'AI Automation Packages for Small Businesses';
  let deepDive = `Your behavioral pattern reveals a strong systems-oriented mind. You see repetitive processes and immediately want to eliminate them — this is extremely rare and highly valuable. The current market is drowning in people who can prompt ChatGPT, but starved of people who can actually build the pipes that make AI useful at scale.\n\nYour biggest risk is over-engineering your first product. You will be tempted to build the perfect 10-step automation before you have a single paying client. Invert this ruthlessly: build the simplest, ugliest version that solves a $500 problem, sell it, then refine.\n\nPosition yourself now as the operational backbone for digital service businesses — creators, consultants, and agency owners who are drowning in manual tasks they haven't automated yet. They'll pay well, they need you urgently, and their workflow problems are completely solvable with tools you already know exist.`;
  let marketPositioning = `Position yourself as the "AI Operations Partner" for digital service businesses earning $5K-$30K/month who are bleeding time on manual workflows. Your pitch: "I build the AI systems that run your business while you sleep."`;
  let monetisationPath = `Your fastest path to $1,000 is a "Workflow Automation Audit" package for $297: you spend 2 hours analyzing a business owner's weekly repetitive tasks and deliver a custom Make.com automation that saves them 5+ hours per week. Find 4 clients by posting in Facebook Groups for online business owners.`;
  let strengths = [
    'You think in systems — once you build something it can scale infinitely without more of your time',
    'You naturally spot bottlenecks others overlook, which means clients will pay you to see what they cannot',
    'Your bias for building over talking means you ship proofs of concept faster than competitors who are still planning'
  ];
  let blindSpots = [
    'You will over-engineer your first product — ship the ugly version first, perfect it after your first paying client',
    'You tend to underestimate the value of simple solutions; a $50/month Make.com automation that saves someone 10 hours is a premium product'
  ];

  if (builderType === 'maker') {
    archetype = 'visual_creator';
    archetypeName = 'Visual Creator';
    oneLineIdentity = 'Synthesizer of High-Impact Content & AI-Powered Brand Systems';
    offerType = 'Content Production & Visual Brand Systems';
    deepDive = `Your profile reads like someone with unusually strong visual intuition and audience empathy. You naturally think in stories, aesthetics, and emotional resonance — this is not common. In a world where AI can generate infinite generic content, the ability to infuse genuine perspective into visual formats is a major premium skill.\n\nYour trap is perfectionism. You will spend 3 hours tweaking the gradient on a slide instead of posting the imperfect version that would have gotten 12 comments and 3 DMs from potential clients. You need to embrace "good enough to ship" as your operating system.\n\nThe market opportunity right now is enormous: B2B founders are generating great content in text form but cannot design to save their lives. You bridge that gap.`;
    marketPositioning = `Position yourself as the "AI Content Architect" for B2B founders and coaches who have strong ideas but create visually mediocre content. Your pitch: "I turn your raw thoughts into premium visual content that makes your audience stop scrolling."`;
    monetisationPath = `Your fastest path to first revenue is a "$297 Content Sprint" where you take a client's existing blog post or LinkedIn thread and transform it into 5 branded carousel slides, 3 quote graphics, and a short-form video script — all using AI tools. Sell this to 4 coaches or consultants in your network.`;
    strengths = [
      'You have genuine aesthetic intuition — you can see the difference between content that converts and content that scrolls past',
      'Your empathy for audiences means you naturally create content that resonates rather than just informs',
      'You can rapid-prototype visual concepts in hours, giving you a massive speed advantage over traditional designers'
    ];
    blindSpots = [
      'Perfectionism is your primary enemy — the imperfect post published today outperforms the perfect one you are still refining next week',
      'You need to develop a distribution strategy; creating great content without a publishing system is like cooking a meal no one will eat'
    ];
  } else if (builderType === 'explainer') {
    archetype = 'content_operator';
    archetypeName = 'Content Strategist';
    oneLineIdentity = 'Translator of Complex Expertise into High-Value Educational Systems';
    offerType = 'Educational Content & Niche Authority Building';
    deepDive = `Your pattern reveals someone who naturally understands how knowledge transfers between people. You think in explanations, frameworks, and structured learning paths — this is rarer than most people realize. The creator economy is saturated with people producing content, but starved of people who can build systematic educational experiences that actually change behavior.\n\nYour biggest risk is going too broad. You will want to teach everything to everyone. Resist this with everything you have. The narrower your niche, the higher your perceived expertise, the more people pay you.\n\nYou have a genuine opportunity to become the definitive AI guide for a specific professional niche — not "AI for everyone" but "AI for physical therapy clinic owners" or "AI for solo financial advisors." These people have money, they have problems, and almost nobody is speaking their specific language.`;
    marketPositioning = `Position yourself as the definitive AI educator for one specific professional niche you understand deeply. Do not compete in the generic "AI tips" space — carve out "AI tools for [specific audience]" and own it completely.`;
    monetisationPath = `Your fastest first revenue is a $197 "AI Starter Workshop" — a 90-minute live Zoom session teaching your specific niche audience the 5 AI tools that will save them the most time. Sell 10 seats. Run it. Then turn the recording into a self-paced course for passive income.`;
    strengths = [
      'You can break complex concepts into digestible frameworks, which is the core skill of high-paid consultants and educators',
      'Your strategic thinking means you position yourself well in markets — you see the gap before others do',
      'You build trust quickly because you explain your reasoning, which converts audiences into paying students'
    ];
    blindSpots = [
      'You can over-explain and under-ship — perfect frameworks mean nothing without an audience seeing them',
      'Going too broad is your primary trap; hyper-specific niche authority is worth 10x more than general AI knowledge'
    ];
  }

  return {
    archetype: partial.archetype || archetype,
    archetypeName: partial.archetypeName || archetypeName,
    oneLineIdentity: isLLMCopout(partial.oneLineIdentity) ? oneLineIdentity : (partial.oneLineIdentity || oneLineIdentity),
    offerType: partial.offerType || offerType,
    reasoning: partial.reasoning || `Based on your builder profile (${skillIdentity || builderType}), this identity positions you at the intersection of highest demand and your natural strengths.`,
    deepDive: isLLMCopout(partial.deepDive) ? deepDive : (partial.deepDive || deepDive),
    strengths: (partial.strengths && partial.strengths.length > 0 && !isLLMCopout(partial.strengths[0])) ? partial.strengths : strengths,
    blindSpots: (partial.blindSpots && partial.blindSpots.length > 0 && !isLLMCopout(partial.blindSpots[0])) ? partial.blindSpots : blindSpots,
    marketPositioning: isLLMCopout(partial.marketPositioning) ? marketPositioning : (partial.marketPositioning || marketPositioning),
    monetisationPath: isLLMCopout(partial.monetisationPath) ? monetisationPath : (partial.monetisationPath || monetisationPath),
  };
}

function validateIdentityResult(obj: unknown, profile: ActivationProfile): IdentityResult {
  const r = obj as Record<string, any>;

  // Check if critical fields are missing or are LLM copouts
  const isBad = !r.oneLineIdentity || isLLMCopout(r.oneLineIdentity) ||
                !r.deepDive || isLLMCopout(r.deepDive) ||
                !r.offerType;

  if (isBad) {
    logger.warn('[IDENTITY_ENGINE] LLM returned copout or incomplete identity, applying profile-based fallback');
    return buildFallbackFromProfile(profile, r);
  }

  // Patch any missing individual fields
  if (!Array.isArray(r.strengths) || r.strengths.length === 0) {
    r.strengths = ['Systematic execution', 'Clear communication', 'Rapid iteration'];
  }
  if (!Array.isArray(r.blindSpots) || r.blindSpots.length === 0) {
    r.blindSpots = ['Perfectionism preventing shipping', 'Tendency to over-research before acting'];
  }
  if (!r.marketPositioning || isLLMCopout(r.marketPositioning)) {
    r.marketPositioning = 'Position yourself as the go-to specialist for one specific audience problem.';
  }
  if (!r.monetisationPath || isLLMCopout(r.monetisationPath)) {
    r.monetisationPath = 'Your fastest path to first revenue is a productised service that solves one specific problem for a narrow audience.';
  }

  return r as IdentityResult;
}

export async function runIdentityEngine(profile: ActivationProfile): Promise<IdentityResult> {
  logger.info('[AGENT_START]', { agent: 'identityEngine', sessionId: profile.sessionId });

  const systemPrompt = identityEnginePrompt();
  const userMessage = JSON.stringify({
    themes: profile.themes,
    summary: profile.profileSummary,
    // Pass raw normalised answers as backup context
    rawAnswers: profile.normalisedAnswers
  });

  try {
    const result = await withRetry(
      async () => {
        const rawText = await callLLM(systemPrompt, userMessage, { maxTokens: 2000, temperature: 0.3 });
        logger.debug('[LLM_RAW]', { agent: 'identityEngine', raw: rawText });
        const parsed = parseJSON<unknown>(rawText);
        return validateIdentityResult(parsed, profile);
      },
      3,
      'identityEngine'
    );

    logger.info('[AGENT_DONE]', { agent: 'identityEngine', sessionId: profile.sessionId, identity: result.oneLineIdentity });
    return result;
  } catch (err: any) {
    logger.warn('[IDENTITY_ENGINE] All retries failed, applying full profile fallback', { error: err.message });
    return buildFallbackFromProfile(profile, {});
  }
}
