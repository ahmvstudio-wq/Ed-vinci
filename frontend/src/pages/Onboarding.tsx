import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ConversationStep = {
  id: string;
  messages: string[];
  type: 'options' | 'text-input' | 'observation' | 'transition';
  options?: string[];
  placeholder?: string;
  nextStep: (answer: string) => string;
  observation?: (answer: string) => string | null;
};

type ChatMessage = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  isObservation?: boolean;
};

// ─── CONVERSATION TREE ───────────────────────────────────────────────────────

const CONVERSATION_STEPS: Record<string, ConversationStep> = {
  welcome: {
    id: 'welcome',
    messages: [
      "Hi, what's up?",
      "Tell me your name."
    ],
    type: 'text-input',
    placeholder: "Type your name...",
    nextStep: () => 'explain_capabilities',
    observation: () => null
  },

  explain_capabilities: {
    id: 'explain_capabilities',
    messages: [
      "Nice to meet you, {{name}}! ◆",
      "Ed-Vinci is the activation engine for the AI generation.",
      "Instead of reading lists of tools or watching another course, the product explains itself through the experience.",
      "Right here in this chat, I'm going to guide you to:",
      "1. Diagnose your unique AI Builder Archetype",
      "2. Gauge your current Focus & Momentum levels",
      "3. Set up your personalized 30-Day Execution Roadmap",
      "4. Match you with an AI Buddy built for your style",
      "Ready to start building?"
    ],
    type: 'options',
    options: ["Let's do it!", "I'm ready"],
    nextStep: () => 'start',
    observation: () => null
  },

  start: {
    id: 'start',
    messages: [
      "Awesome, let's get straight to it.",
      "Tell me straight up.",
      "Are you feeling like you're falling behind right now?"
    ],
    type: 'options',
    options: ['Yeah man', 'A little bit', 'Nah I\'m good'],
    nextStep: (answer) => {
      if (answer === 'Yeah man') return 'behind_yes';
      if (answer === 'A little bit') return 'behind_little';
      return 'behind_no';
    },
    observation: (answer) => {
      if (answer === 'Yeah man') return "Respect for keeping it 100. Most people lie to themselves about that.";
      if (answer === 'A little bit') return "I feel that. Good on you for being self-aware.";
      return null;
    }
  },

  behind_yes: {
    id: 'behind_yes',
    messages: [
      "I hear you. That honesty is rare bro.",
      "So tell me...",
      "What's really been eating at you?"
    ],
    type: 'options',
    options: [
      "I literally have no idea where to start",
      "I start stuff but drop it halfway",
      "I feel like I'm running out of time"
    ],
    nextStep: (answer) => {
      if (answer === "I literally have no idea where to start") return 'paralysis';
      if (answer === "I start stuff but drop it halfway") return 'scattered';
      return 'urgency';
    },
    observation: (answer) => {
      if (answer === "I literally have no idea where to start") return "Sounds like you're just overwhelmed by all the noise, not confused.";
      if (answer === "I start stuff but drop it halfway") return "Bro, you ain't lazy. You're just taking on too much at once.";
      return "That panic is real. But we can use that energy to get moving.";
    }
  },

  behind_little: {
    id: 'behind_little',
    messages: [
      "Gotcha.",
      "Honestly, whenever my boys say 'a little bit'...",
      "They usually know exactly what they need to do, they just ain't doing it yet.",
      "What's holding you back the most right now?"
    ],
    type: 'options',
    options: [
      "Too many options, I can't decide",
      "I just don't have the time",
      "Not sure if my ideas are actually good"
    ],
    nextStep: () => 'ambition',
    observation: (answer) => {
      if (answer === "Too many options, I can't decide") return "That's a clarity issue bro, not a skills issue. Easy fix.";
      if (answer === "I just don't have the time") return "You got the time man, you just need a better system.";
      return "Who cares if the ideas are good? You just gotta start.";
    }
  },

  behind_no: {
    id: 'behind_no',
    messages: [
      "Okay, I see the confidence! I like it.",
      "So if you're not falling behind...",
      "What are you actually building right now?"
    ],
    type: 'options',
    options: [
      "Got ideas but haven't pulled the trigger",
      "I'm in the trenches building right now",
      "Just exploring and learning"
    ],
    nextStep: (answer) => {
      if (answer === "I'm in the trenches building right now") return 'already_building';
      return 'ambition';
    },
    observation: (answer) => {
      if (answer === "Got ideas but haven't pulled the trigger") return "Haha so you might be a little behind, but you're chilling. Fair enough.";
      if (answer === "I'm in the trenches building right now") return "Let's gooo. Let's see how we can put some jet fuel on that.";
      return "Exploring is cool, but eventually you gotta ship something, bro.";
    }
  },

  paralysis: {
    id: 'paralysis',
    messages: [
      "Here's the deal with not knowing where to start...",
      "It's never a lack of info.",
      "It's having way too much of it flying at you.",
      "Which of these sounds like you?"
    ],
    type: 'options',
    options: [
      "I binge tutorials but never build anything",
      "I overthink every tiny decision",
      "I just don't know what I'd vibe with building"
    ],
    nextStep: () => 'ambition',
    observation: (answer) => {
      if (answer === "I binge tutorials but never build anything") return "Classic tutorial hell. Trust me, you're not the only one stuck there.";
      if (answer === "I overthink every tiny decision") return "Bro, overthinking is just fear in disguise.";
      return "That's honestly the best problem to have. We'll figure it out together.";
    }
  },

  scattered: {
    id: 'scattered',
    messages: [
      "Starting is the easy part. Actually finishing is where people choke.",
      "When you ditch a project, what's usually the reason?"
    ],
    type: 'options',
    options: [
      "I just get bored after the hype dies down",
      "I hit a wall and lose all my momentum",
      "I see something shinier and jump ship"
    ],
    nextStep: () => 'ambition',
    observation: (answer) => {
      if (answer === "I just get bored after the hype dies down") return "That means you're picking the wrong projects, bro. Not a discipline issue.";
      if (answer === "I hit a wall and lose all my momentum") return "You just need a system so you don't get stuck alone.";
      return "Shiny object syndrome is a killer, but it means you're hungry. We just need to give you some focus.";
    }
  },

  urgency: {
    id: 'urgency',
    messages: [
      "That feeling of the clock ticking?",
      "It's super valid man. Everything is moving crazy fast.",
      "But here's what everyone gets wrong...",
      "You don't need to learn everything. You just need to build ONE thing.",
      "What kind of impact are you trying to make?"
    ],
    type: 'options',
    options: [
      "I wanna make something people actually use",
      "I'm trying to build a business and get paid",
      "I want to make a name for myself in this space"
    ],
    nextStep: () => 'ambition',
    observation: () => null
  },

  already_building: {
    id: 'already_building',
    messages: [
      "Love to hear it. Most people are just watching TikToks about what you're already doing.",
      "What's the project about, bro?"
    ],
    type: 'text-input',
    placeholder: "Tell me what you're working on...",
    nextStep: () => 'ambition',
    observation: () => "Sounds dope. You clearly care about building real stuff."
  },

  ambition: {
    id: 'ambition',
    messages: [
      "Alright, let's talk ambition.",
      "When you picture yourself a year from now, totally crushing it...",
      "What does that actually look like for you?"
    ],
    type: 'options',
    options: [
      "I've launched something real that people use",
      "I'm cashing out from my AI skills",
      "People know me as a serious builder",
      "I found my niche and I'm dominating it"
    ],
    nextStep: () => 'learning_style',
    observation: (answer) => {
      if (answer === "I've launched something real that people use") return "Pure builder energy. That's the stuff you can't fake.";
      if (answer === "I'm cashing out from my AI skills") return "Get that bag bro. Respect the hustle.";
      if (answer === "People know me as a serious builder") return "Playing the long game for rep. Very smart.";
      return "Going deep instead of wide. I like that strategy.";
    }
  },

  learning_style: {
    id: 'learning_style',
    messages: [
      "Almost done man. One super important thing.",
      "How do you actually learn stuff best?",
      "Not how school taught you. How do you ACTUALLY learn?"
    ],
    type: 'options',
    options: [
      "Throw me in the deep end and let me figure it out",
      "Show me an example first, then I'll try",
      "Give me super tiny steps I can just follow",
      "I need to watch someone else do it first"
    ],
    nextStep: () => 'consistency',
    observation: (answer) => {
      if (answer === "Throw me in the deep end and let me figure it out") return "A true explorer. We're gonna give you some fun stuff to break.";
      if (answer === "Show me an example first, then I'll try") return "Pattern matcher. Very efficient way to learn.";
      if (answer === "Give me super tiny steps I can just follow") return "Systematic approach. Nothing wrong with that, we'll give you the exact playbook.";
      return "Watch first, do later. Got it. We'll show you the ropes first.";
    }
  },

  consistency: {
    id: 'consistency',
    messages: [
      "Last question bro.",
      "Keep it 100% real with me.",
      "How consistent are you when it comes to following through?"
    ],
    type: 'options',
    options: [
      "Very — once I lock in, I'm locked in",
      "I'm solid for about two weeks",
      "Honestly? Total toss-up depending on the day",
      "I struggle hard with consistency"
    ],
    nextStep: () => 'final',
    observation: (answer) => {
      if (answer === "Very — once I lock in, I'm locked in") return "Then we just gotta point you in the right direction. Easy money.";
      if (answer === "I'm solid for about two weeks") return "Two weeks is plenty to build the foundation. We'll make 'em count.";
      if (answer === "Honestly? Total toss-up depending on the day") return "Appreciate the honesty man. We'll build a system so you don't even need motivation.";
      return "That's exactly why we're here bro. We don't rely on willpower.";
    }
  },

  final: {
    id: 'final',
    messages: [
      "Alright, I got a super clear read on you now.",
      "Gimme a sec to put your profile together..."
    ],
    type: 'transition',
    nextStep: () => 'results',
    observation: () => null
  }
};

// ─── ARCHETYPE GENERATOR ────────────────────────────────────────────────────

function generateResults(answers: Record<string, string>) {
  const archetypes = [
    { name: 'The Architect', emoji: '🏗️', desc: 'You see systems where others see chaos. You want to build infrastructure that lasts.', color: '#4F8EF7' },
    { name: 'The Operator', emoji: '⚡', desc: 'You make things happen. Efficiency is your superpower. You turn ideas into execution.', color: '#F7A94F' },
    { name: 'The Creator', emoji: '🎨', desc: 'You express through building. Your outputs aren\'t just functional — they\'re meaningful.', color: '#E74F9A' },
    { name: 'The Explorer', emoji: '🧭', desc: 'You thrive on discovery. You\'re always first to try new tools and push boundaries.', color: '#4FC7A0' },
    { name: 'The Strategist', emoji: '🎯', desc: 'You think three moves ahead. You don\'t just build — you position.', color: '#9B59B6' },
  ];

  // Deterministic selection based on answers
  const answerStr = Object.values(answers).join('');
  let hash = 0;
  for (let i = 0; i < answerStr.length; i++) {
    hash = ((hash << 5) - hash) + answerStr.charCodeAt(i);
    hash |= 0;
  }
  const archetype = archetypes[Math.abs(hash) % archetypes.length];

  // Momentum score based on consistency + ambition signals
  const consistencyAnswer = answers['consistency'] || '';
  let momentumBase = 58;
  if (consistencyAnswer.includes('commit')) momentumBase = 78;
  else if (consistencyAnswer.includes('2 weeks')) momentumBase = 65;
  else if (consistencyAnswer.includes('depends')) momentumBase = 52;
  else if (consistencyAnswer.includes('struggle')) momentumBase = 45;

  const momentum = Math.min(95, momentumBase + Math.abs(hash % 15));

  // Roadmap items
  const roadmaps = [
    { day: 'Day 1-3', task: 'Set up your AI workspace & ship your first micro-output', icon: '🚀' },
    { day: 'Day 4-7', task: 'Build your first tool-assisted project using cursor + prompts', icon: '🛠️' },
    { day: 'Day 8-14', task: 'Create something someone else finds valuable', icon: '💎' },
    { day: 'Day 15-21', task: 'Develop your signature workflow & share it publicly', icon: '📡' },
    { day: 'Day 22-30', task: 'Ship your proof-of-work and earn your Builder Card', icon: '🏆' },
  ];

  // First challenge
  const challenges = [
    { title: 'Ship a Landing Page', desc: 'Use AI to build and deploy a real landing page in under 2 hours. No templates. Your idea.', difficulty: 'Starter' },
    { title: 'Automate One Workflow', desc: 'Find one repetitive task in your life and build an AI-powered automation for it.', difficulty: 'Starter' },
    { title: 'Build a Micro-Tool', desc: 'Create a small, useful tool that solves a specific problem. Ship it where people can use it.', difficulty: 'Builder' },
    { title: 'Create AI Content', desc: 'Produce one piece of original content using AI as your co-creator. Publish it.', difficulty: 'Creator' },
  ];
  const challenge = challenges[Math.abs(hash) % challenges.length];

  // AI Buddy style
  const buddyStyles = [
    { name: 'The Sharp Coach', desc: 'Direct, no-nonsense, tells you what you need to hear. Celebrates real wins only.', emoji: '🎯' },
    { name: 'The Hype Partner', desc: 'Energetic, encouraging, always pushing you to go bigger. Makes everything feel possible.', emoji: '🔥' },
    { name: 'The Quiet Guide', desc: 'Thoughtful, strategic, asks the right questions. Helps you think clearly.', emoji: '🧠' },
    { name: 'The Builder Buddy', desc: 'Hands-on, practical, always in the trenches with you. Shows by doing.', emoji: '🤝' },
  ];
  const buddy = buddyStyles[Math.abs(hash >> 4) % buddyStyles.length];

  return { archetype, momentum, roadmaps, challenge, buddy };
}

// ─── TYPING ANIMATION COMPONENT ──────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="onb-typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9; // Number of conversation steps

function ProgressBar({ current }: { current: number }) {
  const progress = Math.min(100, (current / TOTAL_STEPS) * 100);
  return (
    <div className="onb-progress-bar">
      <motion.div
        className="onb-progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 5800),
      setTimeout(() => setPhase(4), 7800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="onb-intro-screen">
      {/* Animated ambient orbs */}
      <div className="onb-intro-orbs">
        <motion.div
          className="onb-orb onb-orb-1"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="onb-orb onb-orb-2"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 20, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="onb-orb onb-orb-3"
          animate={{
            scale: [1.1, 1, 1.2, 1.1],
            x: [0, 15, -30, 0],
            y: [0, -30, 10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="onb-intro-content">
        {/* Logo */}
        <AnimatePresence>
          {phase >= 0 && (
            <motion.div
              className="onb-intro-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="onb-logo-icon">◆</span>
              <span className="onb-logo-text">Ed-Vinci</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text reveals */}
        <div className="onb-intro-text-container">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.p
                className="onb-intro-line"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Most people don't fail because they lack information.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase >= 2 && (
              <motion.p
                className="onb-intro-line onb-intro-line-accent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                They fail because they never start building.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase >= 3 && (
              <motion.p
                className="onb-intro-line onb-intro-line-soft"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Let's figure out where you actually are.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              className="onb-intro-actions"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                className="onb-start-btn"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(79, 142, 247, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onStart}
              >
                <span>Start</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
              <Link to="/landing" className="onb-landing-link">
                View Landing Page
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── CONVERSATION SCREEN ──────────────────────────────────────────────────────

function ConversationScreen({
  onComplete,
  answers,
  setAnswers,
}: {
  onComplete: () => void;
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [currentStepId, setCurrentStepId] = useState('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const currentStep = CONVERSATION_STEPS[currentStepId];
 
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);
 
  // Process message queue
  useEffect(() => {
    if (!currentStep) return;
 
    const stepMessages = currentStep.messages;
 
    if (currentMessageIndex < stepMessages.length) {
      setIsTyping(true);
      setShowOptions(false);
 
      const timer = setTimeout(() => {
        let msgText = stepMessages[currentMessageIndex];
        if (msgText.includes('{{name}}')) {
          msgText = msgText.replace('{{name}}', answers['welcome'] || 'there');
        }
        const newMsg: ChatMessage = {
          id: `${currentStepId}-${currentMessageIndex}`,
          text: msgText,
          sender: 'ai',
        };
        setMessages(prev => [...prev, newMsg]);
        setIsTyping(false);

        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
          scrollToBottom();
        }, 600);
      }, currentMessageIndex === 0 ? 1000 : 800);

      return () => clearTimeout(timer);
    } else {
      // All messages shown, show options or handle transition
      if (currentStep.type === 'transition') {
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setTimeout(() => {
          setShowOptions(true);
          scrollToBottom();
          if (currentStep.type === 'text-input' && inputRef.current) {
            inputRef.current.focus();
          }
        }, 400);
      }
    }
  }, [currentMessageIndex, currentStepId]);

  const handleAnswer = (answer: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${currentStepId}`,
      text: answer,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMsg]);
    setShowOptions(false);
    setAnswers(prev => ({ ...prev, [currentStepId]: answer }));
    scrollToBottom();

    // Check for observation
    const observation = currentStep.observation?.(answer);
    if (observation) {
      setTimeout(() => {
        setIsTyping(true);
        scrollToBottom();
        setTimeout(() => {
          const obsMsg: ChatMessage = {
            id: `obs-${currentStepId}`,
            text: observation,
            sender: 'ai',
            isObservation: true,
          };
          setMessages(prev => [...prev, obsMsg]);
          setIsTyping(false);
          scrollToBottom();

          // Move to next step after observation
          setTimeout(() => {
            const nextId = currentStep.nextStep(answer);
            setCurrentStepId(nextId);
            setCurrentMessageIndex(0);
            setStepsCompleted(prev => prev + 1);
          }, 1500);
        }, 1200);
      }, 600);
    } else {
      // Move directly to next step
      setTimeout(() => {
        const nextId = currentStep.nextStep(answer);
        setCurrentStepId(nextId);
        setCurrentMessageIndex(0);
        setStepsCompleted(prev => prev + 1);
      }, 800);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim().length > 0) {
      handleAnswer(textInput.trim());
      setTextInput('');
    }
  };

  return (
    <div className="onb-conversation-screen">
      <header className="onb-conversation-header">
        <div className="onb-header-left">
          <span className="onb-header-logo">◆</span>
          <span className="onb-header-title">Ed-Vinci</span>
        </div>
        <ProgressBar current={stepsCompleted} />
      </header>

      <div className="onb-chat-container">
        <div className="onb-chat-messages">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`onb-message-row ${msg.sender === 'user' ? 'onb-message-user' : 'onb-message-ai'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="onb-avatar-ai">
                    <span>◆</span>
                  </div>
                )}
                <div
                  className={`onb-chat-bubble ${
                    msg.sender === 'user' ? 'onb-chat-user' : 'onb-chat-ai'
                  } ${msg.isObservation ? 'onb-observation' : ''}`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="onb-message-row onb-message-ai"
            >
              <div className="onb-avatar-ai"><span>◆</span></div>
              <TypingIndicator />
            </motion.div>
          )}

          {/* Options */}
          <AnimatePresence>
            {showOptions && currentStep?.type === 'options' && (
              <motion.div
                className="onb-options-container"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentStep.options?.map((option, idx) => (
                  <motion.button
                    key={option}
                    className="onb-option-btn"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {showOptions && currentStep?.type === 'text-input' && (
              <motion.form
                className="onb-text-input-container"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onSubmit={handleTextSubmit}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="onb-text-input"
                  placeholder={currentStep.placeholder || "Type your response..."}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="onb-send-btn"
                  disabled={textInput.trim().length === 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ONBOARDING COMPONENT ────────────────────────────────────────────────

export function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'intro' | 'conversation'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleConversationComplete = () => {
    // Generate results to save to sessionStorage
    const results = generateResults(answers);
    
    // Store results
    sessionStorage.setItem('edvinci_onboarding', JSON.stringify({
      answers,
      results: {
        archetype: results.archetype.name,
        momentum: results.momentum,
        buddy: results.buddy.name,
        challenge: results.challenge.title,
      },
      completedAt: new Date().toISOString(),
    }));

    // Navigate to quiz
    navigate('/quiz');
  };

  return (
    <div className="onb-root">
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="onb-screen-wrapper"
          >
            <IntroScreen onStart={() => setScreen('conversation')} />
          </motion.div>
        )}

        {screen === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="onb-screen-wrapper"
          >
            <ConversationScreen
              onComplete={handleConversationComplete}
              answers={answers}
              setAnswers={setAnswers}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
