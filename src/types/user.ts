// Raw answers from the 8-question quiz
export interface RawAnswers {
  sessionId:    string;          // UUID generated at quiz start
  q1:           string;
  q2:           string;
  q3:           string;
  q4:           string;
  q5:           string;
  q6:           string;
  q7:           string;
  q8:           string;
  email?:       string;          // Optional for Day 2 retention trigger
  name?:        string;          // Optional display name
  submittedAt:  string;          // ISO timestamp
}

// After Input Processor cleans and normalises
export interface NormalisedAnswers extends RawAnswers {
  wordCounts:     Record<string, number>;  // token frequency map
  normalisedAnswers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
  };
  refinedSignal?: string;
}

// After Profile Analyser extracts themes
export interface ActivationProfile extends NormalisedAnswers {
  themes: {
    skillIdentity:   string;       // core builder profile description
    skills:          string[];     // inferred skills from answers
    interests:       string[];     // recurring interest domains
    resistances:     string[];     // fear/avoidance patterns
    goal:            string;       // distilled 30-day goal
    builderType:     'maker' | 'explainer' | 'fixer';
    frictionLevel:   'high' | 'medium' | 'low';
    offerPreference?: 'alone' | 'with_people' | 'for_people';
  };
  profileSummary?: string;        // 3-4 sentence human-readable summary
}
