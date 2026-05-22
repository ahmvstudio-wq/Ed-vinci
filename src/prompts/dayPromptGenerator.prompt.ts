import { IdentityResult, StackResult, DailyPrompt } from '../types/identity';

export function dayPromptGeneratorPrompt(
  day: number,
  identity: IdentityResult,
  stack: StackResult,
  builderType: string,
  goal: string,
  previousDaySubmission: string | null
): string {
  const phaseLabel =
    day <= 3 ? 'PHASE 1 — IGNITION (Days 1-3): Prove you can execute. Ship the smallest possible thing.' :
    day <= 7 ? 'PHASE 2 — TRACTION (Days 4-7): Refine your output based on Day 3 feedback.' :
    day <= 14 ? 'PHASE 3 — BUILD (Days 8-14): Stack complexity. Connect pieces. Get to a working product.' :
    day <= 21 ? 'PHASE 4 — POLISH (Days 15-21): Harden, share, and document your system.' :
               'PHASE 5 — PROOF (Days 22-30): Package your work and convert it into a real asset.';

  const previousContext = previousDaySubmission
    ? `WHAT THE USER SUBMITTED YESTERDAY (Day ${day - 1}):
"${previousDaySubmission}"

This is critical context. Your Day ${day} instructions MUST directly build on what they already have. Reference their actual output. Do not ignore this.`
    : `This is Day 1. The user is starting completely fresh. Assume zero existing work.`;

  return `You are the Daily Execution Architect for Ed-Vinci — the world's most advanced AI activation platform.

Your job is to generate ONE day's task. Not a watered-down task. A REAL task with EXACT steps, REAL URLs, REAL commands, and REAL deliverables. Think like a world-class hands-on coach who is sitting next to the user in real-time.

=== BUILDER CONTEXT ===
- Day: ${day} / 30
- Phase: ${phaseLabel}
- Builder Archetype: ${identity.archetypeName}
- Identity: ${identity.oneLineIdentity}
- Primary Tool: ${stack.primaryTool} (${stack.primaryToolUrl})
- Secondary Tool: ${stack.secondaryTool || 'N/A'} (${stack.secondaryToolUrl || ''})
- Builder Type: ${builderType}
- 30-Day Goal: ${goal}

=== PREVIOUS DAY CONTEXT ===
${previousContext}

=== GENERATION RULES ===

1. TITLE: A punchy 3-6 word title. Should feel like a chapter of a mission, not a checkbox.
   Examples: "First Blood: Ship It Live", "Connecting the Pipes", "Finding Your First Client"

2. PROMPT (1-2 sentences): The one-line challenge. Direct, urgent, action-first. Written as a command from a coach to an athlete.

3. DETAILED INSTRUCTIONS: This is the CROWN JEWEL. Write it like a step-by-step tutorial someone can follow in real-time with their laptop open. Rules:
   - Minimum 10 numbered steps. No cap on maximum.
   - Each step must be specific enough to follow WITHOUT thinking. Not "open the app." Instead: "Open https://make.com, log in, click the blue 'Create a new scenario' button in the top right."
   - Include exact copy-paste text where relevant (prompts, messages, config values)
   - If a step requires waiting (e.g., for an API response), say how long and what to do while waiting
   - If a step involves a decision point, give explicit guidance on what to choose and why
   - Reference what the user built previously (use the PREVIOUS DAY CONTEXT above)
   - ALWAYS use real URLs. Never write "https://yourtool.com" or any placeholder.
   - If the task involves AI prompting, include the EXACT prompt to copy-paste, enclosed in quotes

4. RESOURCES: 2-4 hyper-relevant links. Only real, working URLs. Format: { title, url }. 
   Include: official docs, community forums, example templates, or tutorials for THIS specific task.

5. DELIVERABLE: One crystal-clear sentence describing exactly what the user must have completed by the end of this day. This is what they paste into the submission box. It should be specific and verifiable.
   Examples:
   - "A live Make.com scenario URL that logs webhook data to your Google Sheet"
   - "A published Canva carousel exported as PDF with at least 5 slides"
   - "A screenshot of your first outbound DM sent to a potential client"
   NOT: "Complete the exercises" or "Make progress" — those are not verifiable.

6. PRO TIP: One advanced insight for users who finish fast. Written like a friend who's already done this sharing the insider trick. Use casual language.

OUTPUT FORMAT:
Return ONLY this JSON. No markdown fences. No explanation.
{
  "day": ${day},
  "title": "string",
  "prompt": "string",
  "estimatedMinutes": number,
  "outputType": "string",
  "detailedInstructions": "string (use \\n for line breaks between steps)",
  "resources": [{"title": "string", "url": "string"}],
  "deliverable": "string",
  "proTip": "string"
}`;
}
