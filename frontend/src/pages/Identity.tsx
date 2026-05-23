import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export function Identity() {
  const [data, setData] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const result = window.sessionStorage.getItem('edvinci_result');
    if (!result) {
      navigate('/');
      return;
    }
    setData(JSON.parse(result));
  }, [navigate]);

  if (!data) return null;

  const identity = data.identity || {};
  const dayOne = data.dayOne || {};
  const stack = data.stack || {};

  const handleExport = async () => {
    if (!cardRef.current || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `edvinci-identity-${(identity.archetypeName || 'card').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="id-root">
      <div className="quiz-bg-orbs">
        <div className="quiz-bg-orb quiz-bg-orb-1" />
        <div className="quiz-bg-orb quiz-bg-orb-2" />
      </div>

      <div className="id-content">
        <motion.div
          className="id-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="id-title">Your Operating Identity</h1>
          <p className="id-subtitle">Your hidden market value, revealed.</p>
        </motion.div>

        <div className="id-bento">
          {/* ── Identity Core Card (exportable) ── */}
          <motion.div
            ref={cardRef}
            className="id-card-main"
            style={{ gridColumn: 'span 12' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div className="id-avatar-box">
                {identity.archetypeName?.charAt(0) || '◆'}
              </div>

              <div className="id-main-info">
                <div className="id-label">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lp-blue)', display: 'inline-block' }}></span>
                  Skill Identity
                </div>
                <h2 className="id-archetype">
                  {identity.oneLineIdentity || identity.archetypeName || 'Calculating Identity...'}
                </h2>

                <div className="id-deep-dive">
                  {identity.deepDive ? (
                    identity.deepDive.split('\n\n').map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))
                  ) : (
                    <p>{identity.reasoning || 'Building your strategic blueprint...'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths & Blind Spots */}
            <div className="id-traits-grid">
              <div className="id-trait-card">
                <h3 className="id-trait-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--lp-blue)' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Natural Advantages
                </h3>
                <ul className="id-trait-list">
                  {(identity.strengths || ['Systematic thinking', 'Pattern recognition', 'Problem decomposition']).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="id-trait-card warning">
                <h3 className="id-trait-title" style={{ color: 'var(--lp-amber)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Operational Blind Spots
                </h3>
                <ul className="id-trait-list">
                  {(identity.blindSpots || ['Perfectionism preventing shipping', 'Over-engineering solutions']).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Market & Monetisation */}
            <div className="id-market-grid">
              <div className="id-market-card">
                <h4 className="id-market-title">Market Positioning</h4>
                <p className="id-market-desc">{identity.marketPositioning || 'Position yourself as an authority in your specific niche.'}</p>
              </div>
              <div className="id-market-card monetisation">
                <h4 className="id-market-title">Monetisation Path</h4>
                <p className="id-market-desc">{identity.monetisationPath || 'Build a scalable productised service around your core skill.'}</p>
              </div>
            </div>

            {/* Ed-Vinci watermark inside exported card */}
            <div className="id-card-watermark">
              <span className="id-watermark-icon">◆</span>
              <span className="id-watermark-text">Found my direction at Ed-Vinci · edvinci.ai</span>
            </div>
          </motion.div>

          {/* Engine / Tool Stack */}
          <motion.div
            className="id-card-side"
            style={{ gridColumn: 'span 6' }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="id-card-side-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Recommended Engine
            </div>
            <div className="id-tool-box" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <p className="id-tool-name" style={{ fontSize: '24px' }}>{stack.primaryTool || 'Pending'}</p>
                {stack.primaryToolUrl && (
                  <a href={stack.primaryToolUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--lp-blue)', fontWeight: 600, textDecoration: 'none' }}>
                    Open Tool ↗
                  </a>
                )}
              </div>
              <p className="id-tool-desc" style={{ marginTop: '8px' }}>{stack.primaryReason || 'Determining the best engine for your workflow.'}</p>
            </div>

            {stack.setupSteps && stack.setupSteps.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div className="id-label" style={{ fontSize: '11px' }}>Quick Setup</div>
                <ol className="id-setup-steps">
                  {stack.setupSteps.map((step: string, i: number) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: step.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') }} />
                  ))}
                </ol>
              </div>
            )}

            {stack.starterPrompt && (
              <div className="id-starter-prompt">
                <span className="id-prompt-label">Day 1 Copy-Paste Command</span>
                {stack.starterPrompt}
              </div>
            )}
          </motion.div>

          {/* First Project (Day One) */}
          <motion.div
            className="id-card-wide"
            style={{ gridColumn: 'span 6' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="id-card-side-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              Tonight's Objective
            </div>

            <div className="id-project" style={{ fontSize: '20px', marginTop: '16px', marginBottom: '12px' }}>
              {dayOne.firstProject || 'Architecting your first milestone...'}
            </div>

            {dayOne.projectDescription && (
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--lp-muted)', margin: '0 0 24px' }}>
                {dayOne.projectDescription}
              </p>
            )}

            {dayOne.stepByStep && dayOne.stepByStep.length > 0 && (
              <div>
                <div className="id-label" style={{ fontSize: '11px' }}>Action Plan</div>
                <ol className="id-setup-steps" style={{ paddingLeft: '16px' }}>
                  {dayOne.stepByStep.map((step: string, i: number) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: step.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') }} />
                  ))}
                </ol>
              </div>
            )}

            {dayOne.deliverable && (
              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(79,199,160,0.06)', borderRadius: '12px', border: '1px solid rgba(79,199,160,0.2)' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--lp-teal)', marginBottom: '4px' }}>
                  Tonight's Deliverable
                </span>
                <span style={{ fontSize: '14px', color: 'var(--lp-dark)', fontWeight: 500 }}>
                  {dayOne.deliverable}
                </span>
                {dayOne.exampleUrl && (
                  <a href={dayOne.exampleUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--lp-blue)', fontWeight: 600, textDecoration: 'none' }}>
                    See an example ↗
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* CTA Row */}
          <motion.div
            className="id-cta-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Export button */}
            <motion.button
              className="id-export-btn"
              onClick={handleExport}
              disabled={exporting}
              whileHover={!exporting ? { scale: 1.02, y: -1 } : {}}
              whileTap={!exporting ? { scale: 0.97 } : {}}
            >
              {exporting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', fontSize: '16px' }}
                  >
                    ⟳
                  </motion.span>
                  <span>Exporting…</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Card</span>
                </>
              )}
            </motion.button>

            <button
              className="lp-btn-primary lp-btn-large"
              onClick={() => navigate('/path')}
              style={{ flex: 1, maxWidth: '400px', justifyContent: 'center' }}
            >
              <span>Commit to the 30-Day Path</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
