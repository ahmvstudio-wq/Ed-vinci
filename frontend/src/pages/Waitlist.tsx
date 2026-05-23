import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── ORBS ─────────────────────────────────────────────────────────────────────

function WaitlistOrbs() {
  return (
    <div className="wl-orbs" aria-hidden="true">
      <motion.div
        className="wl-orb wl-orb-1"
        animate={{ scale: [1, 1.25, 1], x: [0, 30, -15, 0], y: [0, -20, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="wl-orb wl-orb-2"
        animate={{ scale: [1.05, 1, 1.1], x: [0, -25, 10, 0], y: [0, 15, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="wl-orb wl-orb-3"
        animate={{ scale: [1, 1.15, 1], x: [0, 15, -25, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── SUCCESS STATE ────────────────────────────────────────────────────────────

const PARTICLE_COLORS = ['#4F8EF7', '#7B61FF', '#E74F9A', '#4FC7A0', '#F7A94F', '#6366F1'];

function SuccessScreen({ email }: { email: string }) {
  const [particles] = useState(() =>
    Array.from({ length: 45 }).map((_, i) => {
      const angle = (i * (360 / 45) + Math.random() * 15) * (Math.PI / 180);
      const distance = 70 + Math.random() * 140;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * 360,
        shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'triangle',
      };
    })
  );

  return (
    <motion.div
      className="wl-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Particle Confetti Blast */}
      <div style={{ position: 'absolute', top: '36px', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 10, width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {particles.map((p) => {
          let borderRadius = '0px';
          let clipPath = 'none';
          if (p.shape === 'circle') {
            borderRadius = '50%';
          } else if (p.shape === 'triangle') {
            clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          }
          return (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius,
                clipPath,
                pointerEvents: 'none',
              }}
              initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0.2, 1, 1, 0.6, 0],
                opacity: [1, 1, 1, 0.6, 0],
                rotate: p.rotation + 360,
              }}
              transition={{
                duration: 1.5,
                ease: [0.1, 0.8, 0.3, 1],
                delay: 0.15 + Math.random() * 0.15,
              }}
            />
          );
        })}
      </div>

      {/* Check ring */}
      <motion.div
        className="wl-success-ring"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="wl-success-ring-inner">
          <span className="wl-success-checkmark">✓</span>
        </div>
      </motion.div>

      <motion.h2
        className="wl-success-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        You're on the list.
      </motion.h2>

      <motion.p
        className="wl-success-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        We'll reach out to <strong>{email}</strong> when your access is ready.
        We're opening in small batches to ensure quality.
      </motion.p>

      {/* What happens next */}
      <motion.div
        className="wl-next-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h3 className="wl-next-title">What happens next</h3>
        <div className="wl-next-steps">
          {[
            { num: '1', text: 'You\'ll receive a confirmation email shortly.' },
            { num: '2', text: 'We\'ll notify you when your batch opens — typically within 2-3 weeks.' },
            { num: '3', text: 'Early waitlist members get permanent founder pricing.' },
          ].map((step) => (
            <div key={step.num} className="wl-next-step">
              <span className="wl-next-num">{step.num}</span>
              <span className="wl-next-text">{step.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* In the meantime */}
      <motion.div
        className="wl-meanwhile"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <h3 className="wl-meanwhile-title">In the meantime</h3>
        <p className="wl-meanwhile-sub">
          The Phase 1-3 prototype is live right now. You can walk through the full onboarding experience
          and get your archetype today — no account required.
        </p>
        <div className="wl-meanwhile-actions">
          <Link to="/onboarding" className="wl-btn-primary">
            <span>Try the Demo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/deck" className="wl-btn-ghost">Read the Deck</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── FORM ─────────────────────────────────────────────────────────────────────

function WaitlistForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) { setError('Please enter a valid email.'); return; }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }

      onSuccess(email);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const roles = [
    'Student / Learner',
    'Career changer',
    'Freelancer / Creator',
    'Entrepreneur / Founder',
    'Developer / Engineer',
    'Parent (for my child)',
    'Educator / Institution',
    'Other',
  ];

  return (
    <motion.div
      className="wl-form-container"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="wl-form-header">
        <div className="wl-eyebrow">
          <span className="wl-eyebrow-dot" />
          Early Access
        </div>
        <h1 className="wl-title">
          Reserve your spot<br />
          <span className="wl-title-accent">in the activation engine.</span>
        </h1>
        <p className="wl-sub">
          Ed-Vinci is opening access in small batches. Join the waitlist and we'll notify you when your
          batch is ready. Early members lock in permanent founder pricing.
        </p>
      </div>

      {/* What you get */}
      <motion.div
        className="wl-perks"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.15 }
          }
        }}
      >
        <h3 className="wl-perks-title">Early access includes</h3>
        {[
          { icon: '⚡', text: 'Priority access before public launch' },
          { icon: '🔒', text: 'Founder pricing — locked in permanently' },
          { icon: '🎯', text: 'Full archetype deep-dive + custom roadmap' },
          { icon: '💬', text: 'Direct feedback channel to the founding team' },
        ].map((p) => (
          <motion.div
            key={p.text}
            className="wl-perk"
            variants={{
              hidden: { opacity: 0, x: -12 },
              visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 90, damping: 12 } }
            }}
          >
            <span className="wl-perk-icon">{p.icon}</span>
            <span className="wl-perk-text">{p.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="wl-form">
        {/* Name */}
        <div className="wl-field">
          <label htmlFor="wl-name" className="wl-label">Name</label>
          <input
            id="wl-name"
            type="text"
            className="wl-input"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Email */}
        <div className="wl-field">
          <label htmlFor="wl-email" className="wl-label">Email *</label>
          <div className={`wl-input-wrapper ${error ? 'wl-input-error' : ''}`}>
            <input
              id="wl-email"
              type="email"
              className="wl-input"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
              disabled={submitting}
              required
            />
            <AnimatePresence>
              {email && isValidEmail && (
                <motion.span
                  className="wl-input-check"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {error && (
            <motion.p className="wl-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              {error}
            </motion.p>
          )}
        </div>

        {/* Role */}
        <div className="wl-field">
          <label htmlFor="wl-role" className="wl-label">I am a...</label>
          <div className="wl-role-grid">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                className={`wl-role-chip ${role === r ? 'wl-role-active' : ''}`}
                onClick={() => setRole(r)}
                disabled={submitting}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="wl-submit-btn"
          disabled={submitting || !email}
          whileHover={!submitting ? { scale: 1.02, boxShadow: '0 8px 40px rgba(79,142,247,0.3)' } : {}}
          whileTap={!submitting ? { scale: 0.97 } : {}}
        >
          {submitting ? (
            <motion.div
              className="wl-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <span>Join the Waitlist</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>

        <p className="wl-privacy">
          No spam. No sharing your data. We'll only contact you when your access is ready.
        </p>
      </form>
    </motion.div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Waitlist() {
  const [state, setState] = useState<'form' | 'success'>('form');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSuccess = (email: string) => {
    setSubmittedEmail(email);
    setState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="wl-root">
      <WaitlistOrbs />

      {/* Top bar */}
      <motion.div
        className="wl-back-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/" className="wl-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <div className="wl-nav-logo">
          <span className="wl-logo-icon">◆</span>
          <span className="wl-logo-text">Ed-Vinci</span>
        </div>
      </motion.div>

      <div className="wl-center">
        <AnimatePresence mode="wait">
          {state === 'form' ? (
            <motion.div key="form" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <WaitlistForm onSuccess={handleSuccess} />
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0 }}>
              <SuccessScreen email={submittedEmail} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
