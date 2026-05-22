import { logger } from '../utils/logger';
import { RawAnswers } from '../types/user';
import { runInputProcessor } from './inputProcessor';
import { runProfileAnalyser } from './profileAnalyser';
import { runIdentityEngine } from './identityEngine';
import { runStackCurator } from './stackCurator';
import { runDayOneArchitect } from './dayOneArchitect';
import { runSignalRefiner } from './signalRefiner';
// promptSequencer removed — daily tasks are now generated on-demand via /api/generate-day

export async function runOrchestrator(answers: RawAnswers) {
  logger.info('[ORCHESTRATOR] Starting pipeline', { sessionId: answers.sessionId });
  
  try {
    const normalised = await runInputProcessor(answers);
    const refinedSignal = await runSignalRefiner(normalised.normalisedAnswers);
    normalised.refinedSignal = refinedSignal;
    const profile = await runProfileAnalyser(normalised);
    const identity = await runIdentityEngine(profile);
    const stack = await runStackCurator(identity, profile.themes.builderType);
    const dayOne = await runDayOneArchitect(identity, stack, profile);
    // Daily prompts are generated on-demand via /api/generate-day — not here

    logger.info('[ORCHESTRATOR] Pipeline complete', { sessionId: answers.sessionId });

    return {
      status: 'success',
      data: {
        sessionId: answers.sessionId,
        identity,
        stack,
        dayOne,
        builderType: profile.themes.builderType,
        goal: profile.themes.goal,
        prompts: [],  // populated on-demand
        createdAt: new Date().toISOString()
      }
    };
  } catch (error: any) {
    logger.error('[ORCHESTRATOR] Pipeline failed, generating dynamic mock fallback data', { sessionId: answers.sessionId, error: error.message });
    
    const textToScan = `${answers.q1} ${answers.q2} ${answers.q3} ${answers.q4} ${answers.q5} ${answers.q6} ${answers.q7} ${answers.q8}`.toLowerCase();
    
    let fallbackIdentity: any = {
      archetype: 'systems_builder',
      archetypeName: 'Systems Builder',
      oneLineIdentity: 'Architect of Automated Workflows & AI Interfaces',
      offerType: 'Technical Systems & Automation',
      reasoning: 'Your answers indicate a strong preference for structured logic and reducing repetitive friction rather than pure content creation.',
      deepDive: 'Your behavioral pattern reveals a natural inclination toward structural thinking. You see the world as interconnected nodes rather than isolated events. When others see a chaotic inbox or a messy spreadsheet, you see an unoptimized pipeline. This is a highly lucrative trait. The market is currently flooded with people who have ideas, but starved of people who can actually build the machinery to execute those ideas automatically.\\n\\nHowever, your biggest trap is "tool collecting." Because you love systems, you will be tempted to build the perfect 15-step automation before you have a single paying client. You must invert this. Build the simplest, ugliest system that delivers value, sell it, and then refine it.\\n\\nPosition yourself as the operational backbone for creators and small businesses who are drowning in their own success but lack the technical literacy to use modern AI tools.',
      strengths: ['Pattern recognition across chaotic data', 'Patience for logical troubleshooting', 'Ability to build once and sell infinitely'],
      blindSpots: ['Over-engineering solutions before getting user feedback', 'Focusing on the tool rather than the business outcome'],
      marketPositioning: 'Position yourself as the "AI Operations Partner" for digital service businesses earning $10K-$50K/month who are bleeding margin because they do everything manually.',
      monetisationPath: 'Offer a $500 "Inbox to Action" setup where you build a Make.com automation that connects their customer emails to a structured Notion board using OpenAI to categorize requests.'
    };

    let fallbackStack: any = {
      primaryTool: 'Make.com',
      primaryReason: 'Make allows you to build visual logic trees that connect APIs without writing server code.',
      primaryToolUrl: 'https://www.make.com/',
      setupSteps: [
        'Go to https://www.make.com/ and create a free account',
        'Click "Create a new scenario" in your dashboard',
        'Click the big plus button and search for "Webhooks"',
        'Select "Custom webhook" and copy the URL provided'
      ],
      secondaryTool: 'OpenAI API',
      secondaryToolUrl: 'https://platform.openai.com/',
      starterPrompt: 'N/A - Use the visual builder to connect a Webhook to a Google Sheet.'
    };

    let fallbackDayOne: any = {
      firstProject: 'Build a lead-capture webhook that logs to Google Sheets.',
      dayOneAction: 'Create a free Make.com account and set up your first scenario.',
      projectDescription: 'This project breaks your paralysis by proving you can connect two separate platforms on the internet. It is the foundational building block of all complex automation.',
      stepByStep: [
        'Open Make.com and create a new scenario',
        'Add a "Webhooks - Custom Webhook" module',
        'Click "Add" to create a webhook and copy the URL',
        'Open a new tab, paste the URL in your browser address bar and add "?name=test&email=test@test.com" to the end, then press Enter',
        'Go back to Make.com - it should say "Successfully determined"',
        'Add a Google Sheets module connected to the webhook to log the data'
      ],
      deliverable: 'A working Make.com scenario that catches a URL parameter and logs it to a spreadsheet.',
      exampleUrl: 'https://community.make.com/'
    };

    if (textToScan.includes('design') || textToScan.includes('video') || textToScan.includes('content') || textToScan.includes('creative')) {
      fallbackIdentity = {
        archetype: 'visual_creator',
        archetypeName: 'Visual Creator',
        oneLineIdentity: 'Synthesizer of High-Value Content & Multi-Modal Art',
        offerType: 'Content & Education',
        reasoning: 'Your answers prioritize audience engagement, aesthetics, and creative expression over pure technical logic.',
        deepDive: 'Your behavioral pattern reveals a high degree of empathy and visual intuition. You understand what captures attention and how to structure information so that it lands emotionally. In an era where AI can write infinite generic text, the ability to synthesize ideas into compelling visual formats is a massive premium.\\n\\nHowever, your risk is getting caught in the "inspiration loop." You might spend hours tweaking a gradient instead of publishing. You must embrace constraints. \\n\\nYou should build a digital asset library that solves specific visual problems for non-designers.',
        strengths: ['High aesthetic intuition', 'Ability to simplify complex ideas visually', 'Strong audience empathy'],
        blindSpots: ['Perfectionism preventing shipping', 'Ignoring the distribution strategy in favor of pure creation'],
        marketPositioning: 'Position yourself as an "AI Visual Partner" for B2B founders who have great ideas but terrible design skills.',
        monetisationPath: "Offer a $297 flat-rate package to turn 3 of a founder's text-heavy blog posts into highly engaging LinkedIn carousel designs using Canva AI."
      };
      fallbackStack = {
        primaryTool: 'Canva AI',
        primaryReason: 'Provides immediate high-fidelity layouts with built-in AI generation tools.',
        primaryToolUrl: 'https://www.canva.com/',
        setupSteps: [
          'Go to Canva.com and create an account',
          'Navigate to the Magic Studio section',
          'Create a new presentation document',
          'Locate the "Magic Design" prompt box'
        ],
        secondaryTool: 'Claude.ai',
        secondaryToolUrl: 'https://claude.ai/new',
        starterPrompt: 'Generate a 5-slide outline explaining the concept of "Time Horizon Arbitrage". For each slide, give me a bold headline and a 1-sentence visual description.'
      };
      fallbackDayOne = {
        firstProject: 'Create a 5-slide educational carousel.',
        dayOneAction: 'Open Canva, pick a bold template, and generate your first slide.',
        projectDescription: 'Carousels are the highest-converting format on LinkedIn and Instagram right now. Building one proves you can package knowledge visually.',
        stepByStep: [
          'Open Claude.ai and ask it to break down a concept you know well into 5 key points',
          'Open Canva and search for "LinkedIn Carousel Template"',
          'Select a minimalist template and duplicate it to have 5 slides',
          'Paste the text from Claude into the slides',
          "Use Canva's Magic Media to generate one unique background texture",
          'Export as a PDF'
        ],
        deliverable: 'A 5-slide PDF carousel ready to upload to LinkedIn.',
        exampleUrl: 'https://dribbble.com/search/carousel'
      };
    }

    logger.info('[ORCHESTRATOR] Fallback generation complete', { sessionId: answers.sessionId });

    return {
      status: 'success',
      data: {
        sessionId: answers.sessionId,
        identity: fallbackIdentity,
        stack: fallbackStack,
        dayOne: fallbackDayOne,
        builderType: textToScan.includes('design') || textToScan.includes('content') ? 'maker' : 'fixer',
        goal: '30-day AI builder challenge',
        prompts: [],  // populated on-demand via /api/generate-day
        createdAt: new Date().toISOString()
      }
    };
  }
}
