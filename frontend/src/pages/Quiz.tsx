import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type StepType =
  | 'build-cards'   // Large visual card grid
  | 'binary'        // Two big options side by side
  | 'multi-choice'  // Horizontal pill choices
  | 'insight'       // AI gives you something back (no input)
  | 'energy-pick'   // Single animated word selection
  | 'final-insight'; // The closing insight before processing

type Step = {
  id: string;
  type: StepType;
  eyebrow?: string;
  question?: string;
  subtext?: string;
  cards?: BuildCard[];
  optionA?: BinaryOption;
  optionB?: BinaryOption;
  choices?: string[];
  words?: string[];
  insight?: InsightData;
  autoAdvance?: number; // ms to auto-advance (for insight screens)
};

type BuildCard = {
  emoji: string;
  title: string;
  desc: string;
  tag: string;
  color: string; // gradient
};

type BinaryOption = {
  label: string;
  sub: string;
  icon: string;
};

type InsightData = {
  lines: string[];
  accent?: string;
};

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

const STEPS: Step[] = [
  // ── STEP 0: Build cards
  {
    id: 'build-vision',
    type: 'build-cards',
    eyebrow: 'Let\'s make this real',
    question: 'If you had 30 days and full AI support — what would you rather build first?',
    cards: [
      { emoji: '🛍️', title: 'AI Business', desc: 'A service or product powered by AI', tag: 'Monetise', color: 'from-blue-50 to-indigo-50' },
      { emoji: '📣', title: 'Content Brand', desc: 'Content that builds an audience', tag: 'Grow', color: 'from-pink-50 to-rose-50' },
      { emoji: '⚙️', title: 'Automation', desc: 'Systems that save hours of work', tag: 'Scale', color: 'from-amber-50 to-orange-50' },
      { emoji: '💼', title: 'Freelance Service', desc: 'Skills people pay for immediately', tag: 'Earn', color: 'from-emerald-50 to-teal-50' },
      { emoji: '🚀', title: 'Startup', desc: 'Something worth building for years', tag: 'Build', color: 'from-violet-50 to-purple-50' },
      { emoji: '🎨', title: 'Creative Project', desc: 'Something meaningful to you', tag: 'Create', color: 'from-sky-50 to-cyan-50' },
    ],
  },

  // ── STEP 1: Momentum test (multi-choice)
  {
    id: 'momentum-pattern',
    type: 'multi-choice',
    eyebrow: 'Honest moment',
    question: 'After you get excited about an idea, what usually happens?',
    subtext: 'No judgment. This shapes everything.',
    choices: [
      'I overthink it to death',
      'I start then quietly disappear',
      'I consume more information',
      'I get overwhelmed by options',
      'I actually execute on it',
    ],
  },

  // ── STEP 2: MID-FLOW INSIGHT (value moment, no input)
  {
    id: 'insight-1',
    type: 'insight',
    autoAdvance: 4000,
    insight: {
      lines: [
        'Here\'s what I\'m already seeing.',
        'You\'re not lacking ambition.',
        'You\'re lacking a system that removes the friction between deciding and doing.',
      ],
      accent: 'That\'s exactly what we\'re about to fix.',
    },
  },

  // ── STEP 3: Binary choice
  {
    id: 'execution-style',
    type: 'binary',
    eyebrow: 'Your execution style',
    question: 'Which one feels more like you?',
    optionA: {
      label: 'I need clarity before starting.',
      sub: 'I want the full picture first.',
      icon: '🗺️',
    },
    optionB: {
      label: 'I learn best by jumping in.',
      sub: 'I figure it out as I go.',
      icon: '🏄',
    },
  },

  // ── STEP 4: Energy words (fast, fun, visual)
  {
    id: 'energy-pick',
    type: 'energy-pick',
    eyebrow: 'Quick instinct',
    question: 'Pick the word that gives you the most energy right now.',
    words: ['Build', 'Launch', 'Automate', 'Create', 'Earn', 'Grow', 'Scale', 'Ship'],
  },

  // ── STEP 5: Final binary — time horizon
  {
    id: 'time-horizon',
    type: 'binary',
    eyebrow: 'Timeframe',
    question: 'What feels most urgent to you?',
    optionA: {
      label: 'I want results within weeks.',
      sub: 'Fast wins motivate me.',
      icon: '⚡',
    },
    optionB: {
      label: 'I\'m building something long-term.',
      sub: 'I think in months and years.',
      icon: '🌱',
    },
  },

  // ── STEP 6: CLOSING INSIGHT (value moment before results)
  {
    id: 'final-insight',
    type: 'final-insight',
    autoAdvance: 0,
    insight: {
      lines: [
        'That\'s enough.',
        'I don\'t need 20 more questions.',
        'I have what I need to build your activation path.',
      ],
      accent: 'Generating your profile now…',
    },
  },
];

// ─── PROGRESS DOTS ────────────────────────────────────────────────────────────

function ProgressDots({ current }: { current: number }) {
  // Don't count insight-only steps in the dots
  const inputSteps = STEPS.filter(s => s.type !== 'insight' && s.type !== 'final-insight');
  const inputCurrent = STEPS.slice(0, current + 1).filter(
    s => s.type !== 'insight' && s.type !== 'final-insight'
  ).length;

  return (
    <div className="quiz-dots">
      {inputSteps.map((_, i) => (
        <motion.div
          key={i}
          className={`quiz-dot ${i < inputCurrent ? 'quiz-dot-done' : i === inputCurrent - 1 ? 'quiz-dot-active' : ''}`}
          animate={{
            width: i === inputCurrent - 1 ? 24 : 8,
            opacity: i < inputCurrent ? 1 : 0.25,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

// ─── BUILD CARDS STEP ─────────────────────────────────────────────────────────

function BuildCardsStep({ step, onAnswer }: { step: Step; onAnswer: (v: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (title: string) => {
    setSelected(title);
    setTimeout(() => onAnswer(title), 380);
  };

  return (
    <div className="quiz-step-inner">
      {step.eyebrow && <p className="quiz-eyebrow">{step.eyebrow}</p>}
      <h2 className="quiz-question">{step.question}</h2>
      <div className="quiz-build-grid">
        {step.cards?.map((card, idx) => (
          <motion.button
            key={card.title}
            className={`quiz-build-card ${selected === card.title ? 'quiz-build-card-selected' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(card.title)}
          >
            <div className={`quiz-card-bg bg-gradient-to-br ${card.color}`} />
            <div className="quiz-card-tag">{card.tag}</div>
            <div className="quiz-card-emoji">{card.emoji}</div>
            <div className="quiz-card-title">{card.title}</div>
            <div className="quiz-card-desc">{card.desc}</div>
            {selected === card.title && (
              <motion.div
                className="quiz-card-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── MULTI-CHOICE STEP ────────────────────────────────────────────────────────

function MultiChoiceStep({ step, onAnswer }: { step: Step; onAnswer: (v: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (choice: string) => {
    setSelected(choice);
    setTimeout(() => onAnswer(choice), 380);
  };

  return (
    <div className="quiz-step-inner">
      {step.eyebrow && <p className="quiz-eyebrow">{step.eyebrow}</p>}
      <h2 className="quiz-question">{step.question}</h2>
      {step.subtext && <p className="quiz-subtext">{step.subtext}</p>}
      <div className="quiz-multi-choices">
        {step.choices?.map((choice, idx) => (
          <motion.button
            key={choice}
            className={`quiz-choice-pill ${selected === choice ? 'quiz-choice-pill-selected' : ''}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, x: 3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(choice)}
          >
            <span className="quiz-choice-bullet" />
            {choice}
            {selected === choice && (
              <motion.span
                className="quiz-choice-check"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── BINARY STEP ──────────────────────────────────────────────────────────────

function BinaryStep({ step, onAnswer }: { step: Step; onAnswer: (v: string) => void }) {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const handleSelect = (side: 'a' | 'b') => {
    setSelected(side);
    const val = side === 'a' ? step.optionA!.label : step.optionB!.label;
    setTimeout(() => onAnswer(val), 420);
  };

  return (
    <div className="quiz-step-inner">
      {step.eyebrow && <p className="quiz-eyebrow">{step.eyebrow}</p>}
      <h2 className="quiz-question">{step.question}</h2>
      <div className="quiz-binary-row">
        {[step.optionA!, step.optionB!].map((opt, i) => {
          const side: 'a' | 'b' = i === 0 ? 'a' : 'b';
          const isSelected = selected === side;
          const isDimmed = selected !== null && selected !== side;
          return (
            <motion.button
              key={i}
              className={`quiz-binary-card
                ${isSelected ? 'quiz-binary-selected' : ''}
                ${isDimmed ? 'quiz-binary-dimmed' : ''}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: isDimmed ? 1 : 1.02, y: isDimmed ? 0 : -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(side)}
            >
              <span className="quiz-binary-icon">{opt.icon}</span>
              <span className="quiz-binary-label">{opt.label}</span>
              <span className="quiz-binary-sub">{opt.sub}</span>
              {isSelected && (
                <motion.div
                  className="quiz-binary-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ENERGY PICK STEP ─────────────────────────────────────────────────────────

function EnergyPickStep({ step, onAnswer }: { step: Step; onAnswer: (v: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (word: string) => {
    setSelected(word);
    setTimeout(() => onAnswer(word), 400);
  };

  const colors = [
    'quiz-word-blue', 'quiz-word-pink', 'quiz-word-amber',
    'quiz-word-teal', 'quiz-word-violet', 'quiz-word-rose',
    'quiz-word-indigo', 'quiz-word-emerald',
  ];

  return (
    <div className="quiz-step-inner quiz-step-centered">
      {step.eyebrow && <p className="quiz-eyebrow text-center">{step.eyebrow}</p>}
      <h2 className="quiz-question text-center">{step.question}</h2>
      <div className="quiz-word-cloud">
        {step.words?.map((word, idx) => (
          <motion.button
            key={word}
            className={`quiz-word-pill ${colors[idx % colors.length]} ${selected === word ? 'quiz-word-selected' : ''}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: idx * 0.055,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelect(word)}
          >
            {word}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── INSIGHT STEP ─────────────────────────────────────────────────────────────

function InsightStep({
  step,
  onDone,
}: {
  step: Step;
  onDone: () => void;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [showAccent, setShowAccent] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const lines = step.insight?.lines || [];

  useEffect(() => {
    setLineIdx(0);
    setShowAccent(false);
    setShowContinue(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setLineIdx(i + 1), 900 + i * 1100));
    });
    timers.push(setTimeout(() => setShowAccent(true), 900 + lines.length * 1100));

    if (step.type === 'insight' && step.autoAdvance) {
      timers.push(setTimeout(onDone, step.autoAdvance));
    } else {
      timers.push(setTimeout(() => setShowContinue(true), 900 + lines.length * 1100 + 600));
    }

    return () => timers.forEach(clearTimeout);
  }, [step.id]);

  return (
    <div className="quiz-insight-screen">
      {/* Floating orb */}
      <motion.div
        className="quiz-insight-orb"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="quiz-insight-content">
        {/* AI avatar pulse */}
        <motion.div
          className="quiz-insight-avatar"
          animate={{ boxShadow: ['0 0 0 0 rgba(79,142,247,0.3)', '0 0 0 16px rgba(79,142,247,0)', '0 0 0 0 rgba(79,142,247,0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ◆
        </motion.div>

        <div className="quiz-insight-lines">
          {lines.map((line, i) => (
            <AnimatePresence key={i}>
              {lineIdx > i && (
                <motion.p
                  className={`quiz-insight-line ${i === 0 ? 'quiz-insight-line-sm' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.p>
              )}
            </AnimatePresence>
          ))}

          <AnimatePresence>
            {showAccent && step.insight?.accent && (
              <motion.p
                className="quiz-insight-accent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {step.insight.accent}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Manual continue for final-insight */}
        <AnimatePresence>
          {showContinue && (
            <motion.button
              className="quiz-insight-continue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDone}
            >
              <span>See my results</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN QUIZ COMPONENT ──────────────────────────────────────────────────────

export function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const currentStep = STEPS[currentIdx];
  const isLastStep = currentIdx === STEPS.length - 1;

  const handleAnswer = (value: string) => {
    if (isTransitioning) return;

    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);
    advance(newAnswers);
  };

  const handleInsightDone = () => {
    if (isTransitioning) return;
    if (isLastStep) {
      // Read onboarding answers from sessionStorage
      let onboardingAnswers = {};
      try {
        const onboardingData = sessionStorage.getItem('edvinci_onboarding');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.answers) {
            onboardingAnswers = parsed.answers;
          }
        }
      } catch (e) {
        console.error('Failed to parse onboarding answers:', e);
      }

      // Navigate to processing with merged answers
      const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
      navigate('/processing', {
        state: {
          answers: { ...answers, ...onboardingAnswers, sessionId },
        },
      });
    } else {
      advance(answers);
    }
  };

  const advance = (currentAnswers: Record<string, string>) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentIdx < STEPS.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Read onboarding answers from sessionStorage
        let onboardingAnswers = {};
        try {
          const onboardingData = sessionStorage.getItem('edvinci_onboarding');
          if (onboardingData) {
            const parsed = JSON.parse(onboardingData);
            if (parsed.answers) {
              onboardingAnswers = parsed.answers;
            }
          }
        } catch (e) {
          console.error('Failed to parse onboarding answers:', e);
        }

        const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
        navigate('/processing', {
          state: {
            answers: { ...currentAnswers, ...onboardingAnswers, sessionId },
          },
        });
      }
      setIsTransitioning(false);
    }, 200);
  };

  const isInsight = currentStep.type === 'insight' || currentStep.type === 'final-insight';

  return (
    <div className="quiz-root">
      {/* Ambient background */}
      <div className="quiz-bg-orbs">
        <div className="quiz-bg-orb quiz-bg-orb-1" />
        <div className="quiz-bg-orb quiz-bg-orb-2" />
      </div>

      {/* Header */}
      {!isInsight && (
        <header className="quiz-header">
          <div className="quiz-header-logo">
            <span className="quiz-logo-icon">◆</span>
            <span className="quiz-logo-text">Ed-Vinci</span>
          </div>
          <ProgressDots current={currentIdx} />
          <div className="quiz-header-spacer" />
        </header>
      )}

      {/* Step content */}
      <main className={`quiz-main ${isInsight ? 'quiz-main-insight' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: isInsight ? 0 : 30, scale: isInsight ? 0.97 : 1 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isInsight ? 0 : -30, scale: isInsight ? 0.97 : 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="quiz-step-container"
          >
            {currentStep.type === 'build-cards' && (
              <BuildCardsStep step={currentStep} onAnswer={handleAnswer} />
            )}
            {currentStep.type === 'multi-choice' && (
              <MultiChoiceStep step={currentStep} onAnswer={handleAnswer} />
            )}
            {currentStep.type === 'binary' && (
              <BinaryStep step={currentStep} onAnswer={handleAnswer} />
            )}
            {currentStep.type === 'energy-pick' && (
              <EnergyPickStep step={currentStep} onAnswer={handleAnswer} />
            )}
            {(currentStep.type === 'insight' || currentStep.type === 'final-insight') && (
              <InsightStep step={currentStep} onDone={handleInsightDone} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
