export type BuilderArchetype =
  | 'content_operator'
  | 'systems_builder'
  | 'visual_creator'
  | 'code_automator'
  | 'research_analyst'
  | 'community_builder'
  | 'product_thinker'
  | 'business_operator';

export interface IdentityResult {
  archetype:          string;
  archetypeName:      string;
  oneLineIdentity:    string;
  offerType:          string;
  reasoning:          string;
  deepDive:           string;       // 3-4 paragraph psychological analysis
  strengths:          string[];     // 3-4 specific strengths
  blindSpots:         string[];     // 2-3 honest risks/blindspots
  marketPositioning:  string;       // exactly how to position in market
  monetisationPath:   string;       // specific way to make money
}

export interface StackResult {
  primaryTool:        string;
  primaryReason:      string;
  primaryToolUrl:     string;       // exact clickable URL
  setupSteps:         string[];     // 3-5 exact steps from zero
  secondaryTool:      string;       // complementary tool
  secondaryToolUrl:   string;       // URL for secondary tool
  starterPrompt:      string;       // exact copy-paste prompt for Day 1
}

export interface DayOnePlan {
  firstProject:       string;
  dayOneAction:       string;
  projectDescription: string;       // 2-3 sentences on why this project
  stepByStep:         string[];     // 5-8 exact steps for tonight
  deliverable:        string;       // what user has by end of tonight
  exampleUrl:         string;       // link to example of finished version
}

export interface BuilderCard {
  sessionId:    string;
  identity:     IdentityResult;
  stack:        StackResult;
  dayOne:       DayOnePlan;
  prompts:      DailyPrompt[];
  cardImageUrl: string;
  createdAt:    string;
}

export interface DailyPromptResource {
  title: string;
  url:   string;
}

export interface DailyPrompt {
  day:                  number;
  title:                string;
  prompt:               string;
  estimatedMinutes:     number;
  outputType:           string;
  detailedInstructions: string;                // 3-5 paragraph deep instructions
  resources:            DailyPromptResource[];  // 2-4 real links
  deliverable:          string;                // what user submits as proof
  proTip:               string;                // advanced tip for fast finishers
}
