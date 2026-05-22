import { RawAnswers, NormalisedAnswers, ActivationProfile } from './user';
import { IdentityResult, StackResult } from './identity';

export interface JobPayload {
  sessionId: string;
}

export interface InputProcessorJob extends JobPayload {
  answers: RawAnswers;
}

export interface ProfileAnalyserJob extends JobPayload {
  normalised: NormalisedAnswers;
}

export interface IdentityEngineJob extends JobPayload {
  profile: ActivationProfile;
}

export interface StackCuratorJob extends JobPayload {
  identity: IdentityResult;
  profile: ActivationProfile;
}

export interface DayOneArchitectJob extends JobPayload {
  identity: IdentityResult;
  stack: StackResult;
  profile: ActivationProfile;
}

export interface PromptSequencerJob extends JobPayload {
  identity: IdentityResult;
  stack: StackResult;
  profile: ActivationProfile;
}

export interface CardGeneratorJob extends JobPayload {
  identity: IdentityResult;
  stack: StackResult;
}
