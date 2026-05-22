import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressState {
  currentDay: number;
  completedDays: number[];
  submissions: Record<number, string>;
  streak: number;
  lastCompletedDate: string | null;
  requestedWSocietyInvite: boolean;
  proofUrl?: string;
}

export function Path() {
  const [data, setData] = useState<any>(null);
  const [progress, setProgress] = useState<ProgressState>({
    currentDay: 1,
    completedDays: [],
    submissions: {},
    streak: 0,
    lastCompletedDate: null,
    requestedWSocietyInvite: false,
    proofUrl: ''
  });
  const [selectedDay, setSelectedDay] = useState(1);
  const [submission, setSubmission] = useState('');
  const [proofInput, setProofInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // On-demand generated prompts — stored in localStorage keyed by sessionId
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<number, any>>({});
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);

  // Overlay control states
  const [showDay3Overlay, setShowDay3Overlay] = useState(false);
  const [showDay14Overlay, setShowDay14Overlay] = useState(false);
  const [showGraduationOverlay, setShowGraduationOverlay] = useState(false);
  const [gradSuccess, setGradSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const result = window.sessionStorage.getItem('edvinci_result');
    if (!result) {
      navigate('/');
      return;
    }
    const parsedData = JSON.parse(result);
    setData(parsedData);

    const sessionId = parsedData.sessionId;
    const localKey = `edvinci_path_progress_${sessionId}`;
    
    // 1. Load from localStorage as fallback immediately
    const localVal = window.localStorage.getItem(localKey);
    let localProgress: ProgressState | null = null;
    if (localVal) {
      try {
        localProgress = JSON.parse(localVal);
        setProgress(localProgress!);
        setSelectedDay(localProgress!.currentDay > 30 ? 30 : localProgress!.currentDay);
      } catch (e) {
        console.error('Error parsing local progress', e);
      }
    }

    // 2. Sync with Backend
    const syncProgress = async () => {
      try {
        setSyncing(true);
        const res = await fetch(`/api/progress/${sessionId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const server = json.data;
            
            // Calculate streak expiration on client side based on last completed date
            let serverStreak = server.streak || 0;
            if (server.lastCompletedDate) {
              const today = new Date();
              today.setHours(0,0,0,0);
              const lastDate = new Date(server.lastCompletedDate);
              lastDate.setHours(0,0,0,0);
              const diffTime = Math.abs(today.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays > 1) {
                serverStreak = 0; // Streak expired
              }
            }

            const merged: ProgressState = {
              currentDay: Math.max(server.currentDay || 1, localProgress?.currentDay || 1),
              completedDays: Array.from(new Set([
                ...(server.completedDays || []),
                ...(localProgress?.completedDays || [])
              ])),
              submissions: {
                ...(server.submissions || {}),
                ...(localProgress?.submissions || {})
              },
              streak: serverStreak,
              lastCompletedDate: server.lastCompletedDate || localProgress?.lastCompletedDate || null,
              requestedWSocietyInvite: server.requestedWSocietyInvite || localProgress?.requestedWSocietyInvite || false,
              proofUrl: server.proofUrl || localProgress?.proofUrl || ''
            };

            setProgress(merged);
            setSelectedDay(merged.currentDay > 30 ? 30 : merged.currentDay);
            
            // Write back merged to local storage
            window.localStorage.setItem(localKey, JSON.stringify(merged));
            
            // POST merged back to backend
            await fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, ...merged })
            });

            // Trigger graduation overlay if day 30 is completed
            if (merged.currentDay > 30) {
              setShowGraduationOverlay(true);
              if (merged.requestedWSocietyInvite) {
                setGradSuccess(true);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to sync progress with backend', err);
      } finally {
        setSyncing(false);
      }
    };

    syncProgress();
  }, [navigate]);

  // ─── ON-DEMAND DAY GENERATOR ─────────────────────────────────────────────────

  const generateDay = useCallback(async (
    day: number,
    sessionData: any,
    previousSubmission: string | null
  ) => {
    if (!sessionData?.identity || !sessionData?.stack) return;

    // Already generated or being generated
    const cacheKey = `edvinci_prompts_${sessionData.sessionId}`;
    const cached: Record<number, any> = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    if (cached[day]) {
      setGeneratedPrompts(prev => ({ ...prev, [day]: cached[day] }));
      return;
    }

    setGeneratingDay(day);
    try {
      const res = await fetch('/api/generate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day,
          previousDaySubmission: previousSubmission,
          identity: sessionData.identity,
          stack: sessionData.stack,
          builderType: sessionData.builderType || 'fixer',
          goal: sessionData.goal || '30-day AI builder challenge'
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.prompt) {
          const prompt = json.prompt;
          // Cache to localStorage
          cached[day] = prompt;
          localStorage.setItem(cacheKey, JSON.stringify(cached));
          setGeneratedPrompts(prev => ({ ...prev, [day]: prompt }));
        }
      }
    } catch (err) {
      console.error(`Failed to generate Day ${day}:`, err);
    } finally {
      setGeneratingDay(null);
    }
  }, []);

  // Generate Day 1 (and restore cache) when data first loads
  useEffect(() => {
    if (!data) return;
    const cacheKey = `edvinci_prompts_${data.sessionId}`;
    const cached: Record<number, any> = JSON.parse(localStorage.getItem(cacheKey) || '{}');

    // Restore all cached prompts into state
    if (Object.keys(cached).length > 0) {
      setGeneratedPrompts(cached);
    }

    // Generate Day 1 if not cached
    if (!cached[1]) {
      generateDay(1, data, null);
    }
  }, [data, generateDay]);

  // When user selects a day, generate it if not yet generated
  useEffect(() => {
    if (!data || generatedPrompts[selectedDay] || generatingDay === selectedDay) return;
    // Only allow generating days up to currentDay (or currentDay + 1 to pre-warm)
    if (selectedDay <= progress.currentDay) {
      const prevSubmission = progress.submissions[selectedDay - 1] || null;
      generateDay(selectedDay, data, prevSubmission);
    }
  }, [selectedDay, data, generatedPrompts, generatingDay, progress, generateDay]);

  useEffect(() => {
    // Populate textarea when day is selected
    if (progress.submissions[selectedDay]) {
      setSubmission(progress.submissions[selectedDay]);
    } else {
      setSubmission('');
    }

    if (selectedDay === 3 && progress.proofUrl) {
      setProofInput(progress.proofUrl);
    } else {
      setProofInput('');
    }
  }, [selectedDay, progress.submissions, progress.proofUrl]);


  if (!data) return null;

  const identity = data.identity || {};
  // Use on-demand generated prompts — ignore data.prompts (always empty now)
  const currentPrompt = generatedPrompts[selectedDay] || null;

  const isCompletedDay = progress.completedDays.includes(selectedDay);
  const isActiveDay = selectedDay === progress.currentDay;

  // Streak calculations
  const calculateStreakUpdate = (lastCompletedDateStr: string | null, currentStreak: number): number => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (!lastCompletedDateStr) {
      return 1;
    }
    const lastDate = new Date(lastCompletedDateStr);
    lastDate.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return currentStreak + 1;
    } else if (diffDays === 0) {
      return currentStreak || 1; // Completed another task today, retain streak
    } else {
      return 1; // Broken streak, reset
    }
  };

  const handleDaySelect = (day: number) => {
    if (day <= progress.currentDay) {
      setSelectedDay(day);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission.trim()) return;
    if (selectedDay === 3 && !proofInput.trim() && !progress.proofUrl) return;

    setIsSubmitting(true);
    
    // Simulate minor delay for typing feel
    setTimeout(async () => {
      const todayStr = new Date().toISOString();
      const updatedStreak = calculateStreakUpdate(progress.lastCompletedDate, progress.streak);
      const isFinishingActiveDay = selectedDay === progress.currentDay;
      const nextDay = isFinishingActiveDay ? progress.currentDay + 1 : progress.currentDay;

      const updatedProgress: ProgressState = {
        ...progress,
        currentDay: nextDay,
        completedDays: Array.from(new Set([...progress.completedDays, selectedDay])),
        submissions: {
          ...progress.submissions,
          [selectedDay]: submission
        },
        streak: updatedStreak,
        lastCompletedDate: todayStr
      };

      if (selectedDay === 3) {
        updatedProgress.proofUrl = proofInput;
      }

      setProgress(updatedProgress);
      
      // Save locally
      window.localStorage.setItem(`edvinci_path_progress_${data.sessionId}`, JSON.stringify(updatedProgress));

      // Post to backend
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: data.sessionId, ...updatedProgress })
        });
      } catch (err) {
        console.error('Failed to update progress to server', err);
      }

      setIsSubmitting(false);

      // 🚀 PRE-GENERATE NEXT DAY in the background using this day's submission as context
      if (nextDay <= 30 && isFinishingActiveDay) {
        generateDay(nextDay, data, submission);
      }

      // Handle Milestone Interstitials
      if (selectedDay === 3) {
        setShowDay3Overlay(true);
      } else if (selectedDay === 14) {
        setShowDay14Overlay(true);
      } else if (selectedDay === 30) {
        setShowGraduationOverlay(true);
      } else {
        // Automatically proceed to the next day
        if (nextDay <= 30) {
          setSelectedDay(nextDay);
        }
      }
    }, 600);
  };

  const handleWSocietySubmit = async () => {
    setIsSubmitting(true);
    const updatedProgress = {
      ...progress,
      requestedWSocietyInvite: true
    };
    setProgress(updatedProgress);

    window.localStorage.setItem(`edvinci_path_progress_${data.sessionId}`, JSON.stringify(updatedProgress));

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: data.sessionId, ...updatedProgress })
      });
    } catch (err) {
      console.error('Failed to request invite', err);
    }
    
    setIsSubmitting(false);
    setGradSuccess(true);
  };

  const shareText = `I'm on Day 14 of my Ed-Vinci activation path. I've built my builder identity as a ${identity.archetypeName || 'Creator'}. Join me at edvinci.ai!`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const totalCompleted = progress.completedDays.length;

  return (
    <div className="pth-root">
      {/* Ambient Background Orbs */}
      <div className="quiz-bg-orbs">
        <div className="quiz-bg-orb quiz-bg-orb-1" style={{ opacity: 0.12 }} />
      </div>

      <header className="pth-nav">
        <div className="pth-logo-group" onClick={() => navigate('/identity')}>
          <span className="quiz-logo-icon">◆</span>
          <span className="quiz-logo-text">Ed-Vinci</span>
        </div>
        <div className="pth-nav-right">
          {progress.streak > 0 && (
            <div className="pth-streak-badge">
              <span>🔥 {progress.streak}-day streak</span>
            </div>
          )}
          <div className="pth-day-badge">
            <span>Day {progress.currentDay > 30 ? 30 : progress.currentDay}</span>
            <span style={{ color: 'var(--lp-muted)', marginLeft: 2 }}>/ 30</span>
          </div>
        </div>
        <div className="pth-progress-bar" style={{ width: `${(totalCompleted / 30) * 100}%` }} />
      </header>

      <main className="pth-container">
        {/* Left Panel: Bento Timeline Grid */}
        <aside className="pth-sidebar">
          <div className="flex flex-col gap-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 className="pth-sidebar-title">Your 30-Day Track</h2>
            <span style={{ fontSize: '12px', color: 'var(--lp-muted)' }}>
              {totalCompleted} of 30 days completed
            </span>
          </div>
          <div className="pth-timeline-grid">
            {Array.from({ length: 30 }, (_, idx) => {
              const dayNum = idx + 1;
              const isNodeCompleted = progress.completedDays.includes(dayNum);
              const isNodeActive = dayNum === progress.currentDay;
              const isNodeLocked = dayNum > progress.currentDay;
              
              let nodeClass = 'pth-day-node ';
              if (isNodeCompleted) nodeClass += 'pth-day-node-completed';
              else if (isNodeActive) nodeClass += 'pth-day-node-active';
              else if (isNodeLocked) nodeClass += 'pth-day-node-locked';

              return (
                <div 
                  key={dayNum}
                  className={nodeClass}
                  onClick={() => handleDaySelect(dayNum)}
                  title={isNodeLocked ? 'Locked' : `Day ${dayNum}`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Panel: Active Focus & Text Editor */}
        <section className="pth-main-editor">
          {/* Archetype Welcome Header */}
          <div className="pth-welcome-card">
            <p className="pth-welcome-text">
              Welcome back, <span className="pth-welcome-archetype">{identity.archetypeName || 'Builder'}</span>. 
              {progress.currentDay > 30 ? " You have completed the track." : " Pick up where you left off."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Loading skeleton while AI generates */}
              {!currentPrompt ? (
                <div className="pth-prompt-card">
                  <span className="pth-prompt-subtitle">Day {selectedDay} / Action</span>
                  <div className="pth-skeleton pth-skeleton-title" />
                  <div className="pth-generating-msg">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      ◆ Generating your Day {selectedDay} mission...
                    </motion.span>
                  </div>
                  <div className="pth-skeleton pth-skeleton-line" />
                  <div className="pth-skeleton pth-skeleton-line" style={{ width: '80%' }} />
                  <div className="pth-skeleton pth-skeleton-line" style={{ width: '60%', marginTop: 24 }} />
                  <div className="pth-skeleton pth-skeleton-block" />
                </div>
              ) : (
              <div className="pth-prompt-card">
                <span className="pth-prompt-subtitle">Day {selectedDay} / Action</span>
                <h1 className="pth-prompt-title">
                  {currentPrompt.title || `Task ${selectedDay}`}
                </h1>

                
                {currentPrompt.videoUrl && (
                  <div className="pth-prompt-video">
                    <iframe src={currentPrompt.videoUrl} title={`Day ${selectedDay} Video`} frameBorder="0" allowFullScreen />
                  </div>
                )}
                
                <p className="pth-prompt-desc" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--lp-dark)' }}>
                  {currentPrompt.prompt}
                </p>

                {currentPrompt.detailedInstructions && (
                  <div className="pth-prompt-detailed">
                    <h3 className="pth-detail-heading">Execution Protocol</h3>
                    <div dangerouslySetInnerHTML={{ __html: currentPrompt.detailedInstructions.replace(/\n/g, '<br/>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') }} />
                  </div>
                )}

                {currentPrompt.resources && currentPrompt.resources.length > 0 && (
                  <div className="pth-prompt-resources">
                    <h3 className="pth-detail-heading">Intel & Assets</h3>
                    <ul>
                      {currentPrompt.resources.map((res: any, idx: number) => (
                        <li key={idx}>
                          <a href={res.url} target="_blank" rel="noopener noreferrer">{res.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPrompt.deliverable && (
                  <div className="pth-prompt-deliverable">
                    <span className="pth-deliverable-label">Required Output</span>
                    <p>{currentPrompt.deliverable}</p>
                  </div>
                )}

                {currentPrompt.proTip && (
                  <div className="pth-prompt-protip">
                    <span className="pth-protip-label">💡 Pro Tip</span>
                    <p>{currentPrompt.proTip}</p>
                  </div>
                )}
              </div>
              )} {/* end of currentPrompt ternary */}

              {/* Text submission editor */}
              <form onSubmit={handleSubmit} className="pth-editor-form mt-6" style={{ marginTop: '24px' }}>
                {selectedDay === 3 && !isCompletedDay && (
                  <div className="pth-lock-section">
                    <div className="pth-lock-header">
                      <span>🔒 Milestone Requirement</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--lp-mid)', margin: 0 }}>
                      Day 3 requires logging your first real output. Paste your Loom recording, Figma mockup, GitHub repo, or design link below.
                    </p>
                    <input 
                      type="url"
                      required
                      placeholder="https://github.com/yourusername/project-proof"
                      className="pth-lock-input"
                      value={proofInput}
                      onChange={(e) => setProofInput(e.target.value)}
                    />
                  </div>
                )}

                {selectedDay === 3 && isCompletedDay && progress.proofUrl && (
                  <div className="pth-done-banner" style={{ background: 'rgba(247, 169, 79, 0.05)', color: '#D97706', borderColor: 'rgba(247, 169, 79, 0.15)', marginBottom: '16px' }}>
                    <span className="pth-done-banner-icon">✔</span>
                    <span>Logged Day 3 Proof: <a href={progress.proofUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>{progress.proofUrl}</a></span>
                  </div>
                )}

                <div className="pth-input-area">
                  <textarea
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder={
                      isCompletedDay 
                        ? "Review your logged submission for this day."
                        : "Describe your progress, paste code snippets, or document your build logic here..."
                    }
                    className="pth-textarea"
                    disabled={isSubmitting || isCompletedDay}
                  />
                  <div className="pth-attachment-bar">
                    <div className="pth-attachment-pill" onClick={() => !isCompletedDay && setSubmission(prev => prev + '\n[Attached File placeholder]')}>
                      <span>📎 Attach Sandbox Output</span>
                    </div>
                    <div className="pth-attachment-pill" onClick={() => !isCompletedDay && setSubmission(prev => prev + ' https://')}>
                      <span>🔗 Add External Link</span>
                    </div>
                  </div>
                </div>

                <div className="pth-actions">
                  {isCompletedDay ? (
                    <div className="pth-done-banner">
                      <span className="pth-done-banner-icon">✓</span>
                      <span>Day Completed successfully. Reviewing mode.</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !submission.trim() || (selectedDay === 3 && !proofInput.trim() && !progress.proofUrl)}
                      className="pth-submit-btn"
                    >
                      {isSubmitting ? (
                        <span>Logging Entry...</span>
                      ) : (
                        <>
                          <span>Complete Day {selectedDay}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          <p className="pth-footer-note">One focus. Nothing else exists here.</p>
        </section>
      </main>

      {/* OVERLAYS & MODALS */}

      {/* Day 3 Lock Success Overlay */}
      {showDay3Overlay && (
        <div className="pth-modal-overlay">
          <motion.div 
            className="pth-modal-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="pth-modal-icon">★</div>
            <h3 className="pth-modal-title">Proof Received</h3>
            <p className="pth-modal-desc">
              "That's your first proof. The rest of the track is easier from here."
            </p>
            <div className="pth-modal-actions" style={{ width: '100%' }}>
              <button 
                onClick={() => {
                  setShowDay3Overlay(false);
                  setSelectedDay(4);
                }} 
                className="lp-btn-primary lp-btn-large w-full"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Continue to Day 4
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Day 14 Organic Growth Share Modal */}
      {showDay14Overlay && (
        <div className="pth-modal-overlay">
          <motion.div 
            className="pth-modal-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="pth-modal-icon">📣</div>
            <h3 className="pth-modal-title">Milestone Met</h3>
            <p className="pth-modal-desc">
              You are officially 14 days into your activation. Your skills are shifting. Let the network know.
            </p>
            <div className="pth-share-buttons">
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="pth-share-btn pth-share-btn-twitter"
              >
                <span>Share on X</span>
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="pth-share-btn pth-share-btn-whatsapp"
              >
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="pth-modal-actions w-full">
              <button 
                onClick={() => {
                  setShowDay14Overlay(false);
                  setSelectedDay(15);
                }} 
                className="lp-btn-ghost w-full"
                style={{ borderRadius: 12, width: '100%', justifyContent: 'center' }}
              >
                Continue to Day 15
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Day 30 Graduation Overlay */}
      {showGraduationOverlay && (
        <div className="pth-grad-overlay">
          <motion.div 
            className="pth-grad-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="pth-grad-logo">◆</div>
            <h1 className="pth-grad-title">
              You've earned a look at <span className="pth-grad-title-italic">what comes next.</span>
            </h1>
            
            <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              You completed all 30 days of the Ed-Vinci activation path. You are no longer just planning—you build.
            </p>

            {!gradSuccess ? (
              <div className="pth-grad-card">
                <div className="pth-grad-card-header">MEMBERSHIP</div>
                <h3 className="pth-grad-card-title">Join W Society</h3>
                <div className="pth-grad-card-bullet">
                  <span className="pth-grad-card-bullet-icon">◆</span>
                  <span>Exclusive cohort of high-conviction product builders and engineers.</span>
                </div>
                <div className="pth-grad-card-bullet">
                  <span className="pth-grad-card-bullet-icon">◆</span>
                  <span>Direct dealflow, team matching, and peer accountability circles.</span>
                </div>
                <div className="pth-grad-card-bullet">
                  <span className="pth-grad-card-bullet-icon">◆</span>
                  <span>Capped at 150 active builders globally. Applications reviewed weekly.</span>
                </div>

                <button 
                  onClick={handleWSocietySubmit}
                  disabled={isSubmitting}
                  className="pth-grad-btn"
                  style={{ marginTop: '24px' }}
                >
                  {isSubmitting ? "Submitting Application..." : "Request an Invite"}
                </button>
              </div>
            ) : (
              <div className="pth-grad-card pth-grad-success-card">
                <h3 className="pth-grad-success-title">Request Submitted</h3>
                <p className="pth-grad-success-desc">
                  Pre-filled with your Identity Card and Day 3/30 Proofs. Ahmed will review your output.
                </p>
                <button 
                  onClick={() => setShowGraduationOverlay(false)} 
                  className="lp-btn-ghost"
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginTop: '24px', width: '100%', justifyContent: 'center' }}
                >
                  Back to Track Overview
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
