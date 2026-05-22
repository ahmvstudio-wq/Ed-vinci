import { BuilderArchetype } from '../types/identity';

export const CLARITY_THRESHOLDS = {
  MIN_REQUIRED_SCORE: 50,
};

export const BUILDER_ARCHETYPES: Record<BuilderArchetype, { name: string; coreSignal: string; primaryStack: string[] }> = {
  content_operator: {
    name: 'The Content Operator',
    coreSignal: 'Enjoys creating, storytelling, publishing. Asks: how do I get this in front of people.',
    primaryStack: ['Claude.ai', 'Buffer AI']
  },
  systems_builder: {
    name: 'The Systems Builder',
    coreSignal: 'Wired for process, efficiency, elimination of waste. Asks: how do I make this run itself.',
    primaryStack: ['n8n', 'Claude API']
  },
  visual_creator: {
    name: 'The Visual Creator',
    coreSignal: 'Thinks in images, layouts, aesthetics. Asks: how do I make this look right.',
    primaryStack: ['Canva AI', 'Midjourney']
  },
  code_automator: {
    name: 'The Code Automator',
    coreSignal: 'Comfortable with logic, scripts, tinkering. Asks: how do I build this.',
    primaryStack: ['Claude Code', 'Cursor']
  },
  research_analyst: {
    name: 'The Research Analyst',
    coreSignal: 'Reads deeply, synthesises patterns, loves understanding systems. Asks: what does this actually mean.',
    primaryStack: ['Perplexity', 'Notion AI']
  },
  community_builder: {
    name: 'The Community Builder',
    coreSignal: 'Energised by people, conversations, connecting dots. Asks: who else is thinking about this.',
    primaryStack: ['Claude.ai', 'Beehiiv']
  },
  product_thinker: {
    name: 'The Product Thinker',
    coreSignal: 'Obsessed with problems, solutions, user needs. Asks: why does this work like that.',
    primaryStack: ['Claude.ai', 'Figma AI']
  },
  business_operator: {
    name: 'The Business Operator',
    coreSignal: 'Follows money and leverage. Asks: how does this make or save money.',
    primaryStack: ['Claude.ai', 'Google Sheets AI']
  }
};
