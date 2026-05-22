import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  "Reading your answers",
  "Identifying what you already have",
  "Matching your builder type",
  "Designing your first 30 days",
  "Building your Builder Identity"
];

function getPsychologicalInsights(answers: any): string[] {
  const insights = [
    "Most ready-to-build people are trapped in the over-planning cycle.",
    "Speed of execution is the only metric that separates ideas from outcomes.",
    "The market doesn't care about your plans—it cares about your proof.",
    "Your attention is the target. We are converting it into direction.",
    "True AI proficiency isn't about memorising prompts; it's about output loops."
  ];

  if (!answers) return insights;

  // Customise step 1 insight based on momentum-pattern
  const momentum = answers['momentum-pattern'];
  if (momentum === 'I overthink it to death') {
    insights[1] = "Overthinking is a defense mechanism against potential failure. Action breaks this.";
  } else if (momentum === 'I consume more information') {
    insights[1] = "Consumption gives the illusion of progress. Building is the only real signal.";
  } else if (momentum === 'I start then quietly disappear') {
    insights[1] = "The excitement curve always fades. A structured daily rhythm keeps you building.";
  } else if (momentum === 'I get overwhelmed by options') {
    insights[1] = "Too many choices lead to paralysis. We are selecting a single path for you.";
  }

  // Customise step 2 insight based on execution-style
  const style = answers['execution-style'];
  if (style === 'I need clarity before starting.') {
    insights[2] = "Clarity doesn't precede action. Clarity is the byproduct of building.";
  } else if (style === 'I learn best by jumping in.') {
    insights[2] = "Jumping in builds velocity, but velocity without focus leads to burnout.";
  }

  // Customise step 3 insight based on build-vision
  const vision = answers['build-vision'];
  if (vision === 'AI Business' || vision === 'Startup') {
    insights[3] = "An AI business is built by automating tasks, not just writing code.";
  } else if (vision === 'Content Brand') {
    insights[3] = "Content brands built with AI must focus on unique insight, not mass production.";
  } else if (vision === 'Automation') {
    insights[3] = "Automation systems turn repetitive tasks into assets that work while you sleep.";
  }

  // Customise step 4 insight based on time-horizon
  const timeframe = answers['time-horizon'];
  if (timeframe === 'I want results within weeks.') {
    insights[4] = "Short-term momentum prevents stagnation. Get your first proof in 30 days.";
  } else if (timeframe === "I'm building something long-term.") {
    insights[4] = "A long-term project requires setting up sustainable, repeatable daily actions.";
  }

  return insights;
}

export function Processing() {
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [apiResult, setApiResult] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const apiCalled = useRef(false);
  const answers = location.state?.answers;
  const insights = getPsychologicalInsights(answers);

  useEffect(() => {
    if (apiCalled.current) return;
    apiCalled.current = true;

    const runPipeline = async () => {
      if (!answers) {
        console.error('No answers in state');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('/api/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers)
        });

        if (!response.ok) {
          let errMsg = 'Server error';
          try {
            const errorData = await response.json();
            errMsg = errorData.error || errMsg;
          } catch (e) {
            try {
              const text = await response.text();
              errMsg = text || `HTTP ${response.status}`;
            } catch (_) {
              errMsg = `HTTP ${response.status}`;
            }
          }
          throw new Error(errMsg);
        }

        let result;
        try {
          result = await response.json();
        } catch (e) {
          throw new Error("Invalid response format received from backend.");
        }

        window.sessionStorage.setItem('edvinci_result', JSON.stringify(result.data));
        setApiResult(result.data);
      } catch (err: any) {
        console.error('API Failed:', err);
        setError(err.message || 'An unexpected error occurred.');
      }
    };

    runPipeline();
  }, [answers, navigate]);

  useEffect(() => {
    if (error) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        
        if (apiResult) {
          clearInterval(timer);
          navigate('/identity');
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [apiResult, error, navigate]);

  return (
    <div className="prc-root">
      {/* Ambient Orbs */}
      <div className="quiz-bg-orbs">
        <div className="quiz-bg-orb quiz-bg-orb-1" />
        <div className="quiz-bg-orb quiz-bg-orb-2" />
      </div>
      
      <div className="prc-container">
        {/* Pulsing Core Engine */}
        <motion.div 
          className="prc-engine"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="prc-engine-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="prc-engine-ring prc-engine-ring-inner"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="prc-engine-core">◆</div>
        </motion.div>
        
        {error ? (
          <div className="prc-error-card">
            <div className="prc-error-header">
              <span className="prc-error-icon">◆</span>
              Processing Failed
            </div>
            <p className="prc-error-text">{error}</p>
            <button onClick={() => navigate('/quiz')} className="lp-btn-primary prc-error-btn">
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Adaptive Psychological Insight */}
            <div className="prc-insight-box">
              <div className="prc-insight-eyebrow">Insight Signal</div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  className="prc-insight-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {insights[currentStep] || insights[0]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Steps List */}
            <motion.div 
              className="prc-steps-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <div 
                    key={step} 
                    className={`prc-step ${isActive ? 'prc-step-active' : ''}`}
                  >
                    <div className="prc-step-indicator">
                      <motion.div 
                        className={`prc-step-dot ${
                          isCompleted ? 'prc-step-dot-completed' : 
                          isActive ? 'prc-step-dot-active' : 'prc-step-dot-pending'
                        }`}
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div className={`prc-step-text ${
                      isActive ? 'prc-step-text-active' : 
                      isCompleted ? 'prc-step-text-completed' : 'prc-step-text-pending'
                    }`}>
                      {step}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
