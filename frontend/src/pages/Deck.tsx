import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SLIDE DATA ───────────────────────────────────────────────────────────────

const SLIDES = [
  { id: 'cover', label: 'Cover' },
  { id: 'problem', label: 'Problem' },
  { id: 'market', label: 'Opportunity' },
  { id: 'insight', label: 'Insight' },
  { id: 'solution', label: 'Solution' },
  { id: 'product', label: 'Product' },
  { id: 'stakeholders', label: 'Schools & Parents' },
  { id: 'model', label: 'Pricing & Value' },
  { id: 'traction', label: 'Traction' },
  { id: 'team', label: 'Team & Vision' },
  { id: 'ask', label: 'Join the Journey' },
];

// ─── ORBS ─────────────────────────────────────────────────────────────────────

function DeckOrbs() {
  return (
    <div className="dk-orbs" aria-hidden="true">
      <motion.div
        className="dk-orb dk-orb-1"
        animate={{ scale: [1, 1.15, 1], x: [0, 20, -10, 0], y: [0, -15, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="dk-orb dk-orb-2"
        animate={{ scale: [1.05, 1, 1.1], x: [0, -15, 8, 0], y: [0, 10, -12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── SHARED SLIDE LAYOUT ──────────────────────────────────────────────────────

function SlideLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`dk-slide ${className}`}>
      <div className="dk-slide-content">{children}</div>
    </div>
  );
}

function SlideHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      className="dk-slide-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="dk-eyebrow">{eyebrow}</span>
      <h2 className="dk-slide-heading">{title}</h2>
      {subtitle && <p className="dk-slide-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

// ─── SLIDE 1: COVER ───────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <SlideLayout className="dk-slide-cover">
      <DeckOrbs />
      <div className="dk-cover-inner">
        <motion.div
          className="dk-cover-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="dk-logo-icon">◆</span>
          <span className="dk-logo-text">Ed-Vinci</span>
        </motion.div>
        <motion.h1
          className="dk-cover-headline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          The Activation Engine<br />
          <span className="dk-cover-gradient">for the AI Generation.</span>
        </motion.h1>
        <motion.p
          className="dk-cover-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Converting passive AI consumers into active AI builders through emotionally
          intelligent onboarding, personalized execution systems, and persistent accountability.
        </motion.p>
        <motion.div
          className="dk-cover-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>Beta Preview 1.0</span>
          <span className="dk-cover-divider">·</span>
          <span>2025 Release</span>
          <span className="dk-cover-divider">·</span>
          <span>Active Builder Protocol</span>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 2: PROBLEM ─────────────────────────────────────────────────────────

function ProblemSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="The Problem"
        title="The biggest barrier keeping you from building with AI."
      />
      <motion.div
        className="dk-problem-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="dk-body-text">
          We are in the most abundant era of learning in human history. Every AI tool, tutorial, and framework
          is accessible for free. And yet:
        </p>
        <div className="dk-problem-stats">
          {[
            { stat: '87%', desc: 'of people who engage with AI educational content never build a single project.' },
            { stat: '4.7 hrs', desc: 'average weekly AI content consumption — with zero output produced.' },
            { stat: '3.2%', desc: 'completion rate for project-based AI courses. 96.8% drop off.' },
          ].map((s, i) => (
            <motion.div
              key={s.stat}
              className="dk-problem-stat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="dk-stat-num">{s.stat}</div>
              <div className="dk-stat-desc">{s.desc}</div>
            </motion.div>
          ))}
        </div>
        <p className="dk-body-emphasis">
          This is not an information problem. This is not a tools problem.<br />
          This is a <strong>direction, momentum, and accountability problem.</strong><br />
          And nobody is solving it.
        </p>
      </motion.div>
    </SlideLayout>
  );
}

// ─── SLIDE 3: MARKET SIZE ─────────────────────────────────────────────────────

function MarketSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="Your Opportunity"
        title="Shift from consumer to creator."
        subtitle="The difference between watching tutorials and shipping real projects is where your value is created."
      />
      <div className="dk-market-body">
        <motion.div
          className="dk-tam-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'The Consumer (90%)', value: 'Passive Use', desc: 'Using AI only for basic search, drafting standard emails, or chat. Remaining a passive consumer of technology.' },
            { label: 'The Learner (9%)', value: 'Tutorial Trap', desc: 'Watching hours of video courses and reading tutorials without ever shipping a single custom application.' },
            { label: 'The Builder (1%)', value: 'Active Shipping', desc: 'Deploying real code, custom agents, and functional tools. This is the elite group where you belong.' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              className="dk-tam-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
            >
              <div className="dk-tam-label">{m.label}</div>
              <div className="dk-tam-value" style={{ fontSize: '26px' }}>{m.value}</div>
              <div className="dk-tam-desc">{m.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="dk-market-trends"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="dk-subsection-title">Why Active Building is Your Superpower</h3>
          <div className="dk-trends-list">
            {[
              'AI tools make launching ideas 10x faster, but rare are those who actually build them.',
              'Shipped projects are the ultimate proof of competence, far outweighing online course certificates.',
              'Personalized, active projects defeat learning anxiety and build immediate confidence.',
              'Building custom workflows makes you irreplaceable in any team or industry.',
            ].map((trend, i) => (
              <div key={i} className="dk-trend-item">
                <span className="dk-trend-bullet">→</span>
                <span>{trend}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 4: INSIGHT ─────────────────────────────────────────────────────────

function InsightSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="The Core Insight"
        title="Subtraction, not addition."
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="dk-body-text dk-body-spacious">
          Every product in this space tries to give the user <strong>more</strong> — more courses, more tools,
          more content, more options. The result is more paralysis.
        </p>
        <p className="dk-body-text dk-body-spacious">
          Ed-Vinci does the opposite. We <strong>remove</strong> everything that isn't serving you and replace it
          with exactly one clear signal: who you are as a builder and what to build next.
        </p>

        <div className="dk-insight-comparison">
          <div className="dk-insight-col dk-insight-wrong">
            <h4 className="dk-insight-col-title">Everyone Else</h4>
            <ul className="dk-insight-list">
              <li><span>✕</span> More content to consume</li>
              <li><span>✕</span> Quiz them on preferences</li>
              <li><span>✕</span> Rely on motivation to drive action</li>
              <li><span>✕</span> Generic learning paths</li>
              <li><span>✕</span> Abandon after signup</li>
            </ul>
          </div>
          <div className="dk-insight-col dk-insight-right">
            <h4 className="dk-insight-col-title">Ed-Vinci</h4>
            <ul className="dk-insight-list">
              <li><span>✓</span> Remove friction from starting</li>
              <li><span>✓</span> Understand where they actually are</li>
              <li><span>✓</span> Build systems that don't need motivation</li>
              <li><span>✓</span> Archetype-specific execution paths</li>
              <li><span>✓</span> 30-day persistent accountability</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </SlideLayout>
  );
}

// ─── SLIDE 5: SOLUTION ────────────────────────────────────────────────────────

function SolutionSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="The Solution"
        title="A four-phase activation protocol."
        subtitle="Ed-Vinci is not a course, not a chatbot, and not a productivity tool. It's a complete activation system."
      />
      <div className="dk-solution-phases">
        {[
          {
            num: '01',
            title: 'Emotional Onboarding',
            desc: 'Conversation-first dialogue that understands your actual state — not a form. Adapts to tone, energy, and honesty. ~2 min.',
            color: '#4F8EF7',
          },
          {
            num: '02',
            title: 'Identity Generation',
            desc: 'Places you into one of 5 AI Builder Archetypes. Generates Momentum Score, 30-Day Roadmap, AI Buddy match, and first challenge.',
            color: '#7B61FF',
          },
          {
            num: '03',
            title: 'Momentum Discovery',
            desc: 'Visual cards, binary choices, energy selection. Value given back every 30-60 seconds. Zero interrogation energy. Target: >85% completion.',
            color: '#E74F9A',
          },
          {
            num: '04',
            title: '30-Day Execution Loop',
            desc: 'Daily micro-challenges calibrated to your archetype. AI Buddy accountability. System designed so default action = progress.',
            color: '#4FC7A0',
          },
        ].map((phase, i) => (
          <motion.div
            key={phase.num}
            className="dk-phase-card"
            style={{ '--pc': phase.color } as React.CSSProperties}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <div className="dk-phase-num" style={{ color: phase.color }}>{phase.num}</div>
            <div className="dk-phase-body">
              <h3 className="dk-phase-title">{phase.title}</h3>
              <p className="dk-phase-desc">{phase.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 6: PRODUCT ─────────────────────────────────────────────────────────

function ProductSlide() {
  const [active, setActive] = useState(0);
  const archetypes = [
    { emoji: '🏗️', name: 'The Architect', desc: 'Sees systems where others see chaos. Wants to build infrastructure that lasts.', color: '#4F8EF7' },
    { emoji: '⚡', name: 'The Operator', desc: 'Makes things happen. Efficiency is their superpower. Turns ideas into execution.', color: '#F7A94F' },
    { emoji: '🎨', name: 'The Creator', desc: 'Expresses through building. Outputs aren\'t just functional — they\'re meaningful.', color: '#E74F9A' },
    { emoji: '🧭', name: 'The Explorer', desc: 'Thrives on discovery. Always first to try new tools and push boundaries.', color: '#4FC7A0' },
    { emoji: '🎯', name: 'The Strategist', desc: 'Thinks three moves ahead. Doesn\'t just build — they position.', color: '#9B59B6' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % archetypes.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="The Product"
        title="Personalized activation, not generic learning."
      />
      <div className="dk-product-layout">
        <motion.div
          className="dk-product-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="dk-subsection-title">5 AI Builder Archetypes</h3>
          <div className="dk-arch-list">
            {archetypes.map((a, i) => (
              <div
                key={a.name}
                className={`dk-arch-item ${i === active ? 'dk-arch-active' : ''}`}
                style={{ '--ac': a.color } as React.CSSProperties}
                onClick={() => setActive(i)}
              >
                <span className="dk-arch-emoji">{a.emoji}</span>
                <div>
                  <div className="dk-arch-name">{a.name}</div>
                  <div className="dk-arch-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="dk-product-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="dk-subsection-title">Each profile includes</h3>
          <div className="dk-feature-list">
            {[
              { icon: '📊', title: 'Momentum Score', desc: 'Personalized readiness index based on conversational signals.' },
              { icon: '🗺️', title: '30-Day Roadmap', desc: '5 phase execution plan built around archetype strengths.' },
              { icon: '🤝', title: 'AI Buddy', desc: 'Coach personality matched to working style (4 types).' },
              { icon: '⚡', title: 'First Challenge', desc: 'Day 1 execution challenge calibrated to current level.' },
              { icon: '📈', title: 'Progress Tracking', desc: 'Momentum metrics and streak system (in development).' },
            ].map((f) => (
              <div key={f.title} className="dk-feature-item">
                <span className="dk-feature-icon">{f.icon}</span>
                <div>
                  <div className="dk-feature-title">{f.title}</div>
                  <div className="dk-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 6.5: SCHOOLS & PARENTS ──────────────────────────────────────────────

function StakeholdersSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="Schools & Parents"
        title="Critical validation for parents and schools."
        subtitle="Moving students from passive consumers to active builders requires a multi-stakeholder support system."
      />
      <div className="dk-stakeholders-grid">
        <motion.div
          className="dk-stakeholder-card dk-stakeholder-parents"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="dk-stakeholder-icon">👨‍👩‍👧‍👦</div>
          <h3 className="dk-stakeholder-title">For Parents</h3>
          <p className="dk-stakeholder-desc">
            Redirection of passive screen-time into productive building.
          </p>
          <ul className="dk-stakeholder-list">
            <li><strong>Screen-Time Redirection:</strong> Automatically redirects passive entertainment scrolling into active coding, designing, or building.</li>
            <li><strong>Weekly Shipped Reports:</strong> Parents get a dashboard showing actual shipped projects, not just abstract scores.</li>
            <li><strong>Parental Cohort Support:</strong> Resources to learn alongside their kids and understand their roadmap.</li>
          </ul>
        </motion.div>

        <motion.div
          className="dk-stakeholder-card dk-stakeholder-schools"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="dk-stakeholder-icon">🏫</div>
          <h3 className="dk-stakeholder-title">For Schools & Educators</h3>
          <p className="dk-stakeholder-desc">
            A ready-to-deploy execution sandbox that fits any curriculum.
          </p>
          <ul className="dk-stakeholder-list">
            <li><strong>Portfolio Generation:</strong> Students finish cohorts with live, working AI-native applications they can showcase.</li>
            <li><strong>Progress Dashboards:</strong> Teachers track momentum metrics, identifying which students are stuck in the "tutorial trap."</li>
            <li><strong>Turnkey CS Sandbox:</strong> Acts as a zero-setup extracurricular activation club or fits into existing computer science classes.</li>
          </ul>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 7: BUSINESS MODEL ──────────────────────────────────────────────────

function ModelSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="Pricing & Value"
        title="Three paths tailored to your building goals."
      />
      <div className="dk-model-body">
        {/* Tiers */}
        <motion.div
          className="dk-tiers-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { tier: 'Individual', price: 'Free → $19/mo', go: 'Active', desc: 'Onboard instantly, discover your archetype, and unlock daily execution challenges and matched buddy support.', color: '#4F8EF7' },
            { tier: 'Parent', price: '$149/mo', go: 'Guided', desc: 'Equip your child with critical builder skills. Includes weekly project dashboard reports and professional advisor sessions.', color: '#E74F9A' },
            { tier: 'School / Institution', price: 'Enterprise', go: 'Turnkey', desc: 'Extracurricular builder sandboxes, group analytics, and portfolio showcases built directly into classes.', color: '#F7A94F' },
          ].map((t, i) => (
            <motion.div
              key={t.tier}
              className="dk-tier-card"
              style={{ '--tc': t.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div className="dk-tier-header">
                <span className="dk-tier-name">{t.tier}</span>
                <span className="dk-tier-go">{t.go}</span>
              </div>
              <div className="dk-tier-price">{t.price}</div>
              <p className="dk-tier-desc">{t.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* What You Gain */}
        <motion.div
          className="dk-unit-econ"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="dk-subsection-title">What You Gain (Active Building Metrics)</h3>
          <div className="dk-econ-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { label: 'Focus Hours', value: '10+ / wk', note: 'Redirected from passive browsing into building' },
              { label: 'Shipped Projects', value: '4+ / mo', note: 'A real, functional portfolio of custom AI apps' },
              { label: 'Habit Mastery', value: '15 min / day', note: 'Daily micro-actions that lock in building habits' },
              { label: 'Confidence', value: '100%', note: 'Through persistent progress and accountability' },
            ].map((m) => (
              <div key={m.label} className="dk-econ-item">
                <div className="dk-econ-label">{m.label}</div>
                <div className="dk-econ-value" style={{ fontSize: '20px' }}>{m.value}</div>
                <div className="dk-econ-note">{m.note}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 8: TRACTION ────────────────────────────────────────────────────────

function TractionSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="Traction & Roadmap"
        title="Where we are. Where we're going."
      />
      <div className="dk-traction-body">
        <motion.div
          className="dk-traction-now"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="dk-subsection-title">Current State</h3>
          <div className="dk-traction-items">
            {[
              { label: 'Prototype', value: 'Phase 1-3 Live', note: 'Full emotional onboarding + archetype profiling + momentum discovery — functional and demo-ready.' },
              { label: 'Tech Stack', value: 'React + Vite', note: 'Production-ready frontend. Designed for mobile-first, iOS-safe, accessibility-compliant.' },
              { label: 'Stage', value: 'Beta Release', note: 'Building in public. Open waitlist signup for the first 1,000 active builders.' },
            ].map((item) => (
              <div key={item.label} className="dk-traction-item">
                <div className="dk-traction-label">{item.label}</div>
                <div className="dk-traction-value">{item.value}</div>
                <div className="dk-traction-note">{item.note}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="dk-roadmap-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="dk-subsection-title">Execution Roadmap</h3>
          <div className="dk-roadmap-timeline">
            {[
              { period: 'Now', status: 'live', title: 'Prototype', items: ['Conversation onboarding', 'Archetype profiling', 'Momentum quiz', 'Results generation'] },
              { period: 'Q3 2025', status: 'next', title: 'Execution Engine', items: ['30-day challenge system', 'AI Buddy MVP', 'Push notifications', 'Waitlist → beta'] },
              { period: 'Q4 2025', status: 'planned', title: 'Launch', items: ['Paid tier activation', 'Referral system', 'Community MVP', 'Content partnerships'] },
              { period: '2026', status: 'planned', title: 'Scale', items: ['Parent Tier', 'Institutional sales', 'API & integrations', 'International'] },
            ].map((phase, i) => (
              <motion.div
                key={phase.period}
                className={`dk-roadmap-item dk-roadmap-${phase.status}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="dk-roadmap-dot" />
                <div className="dk-roadmap-content">
                  <div className="dk-roadmap-top">
                    <span className="dk-roadmap-period">{phase.period}</span>
                    <span className={`dk-roadmap-badge dk-badge-${phase.status}`}>
                      {phase.status === 'live' ? '● Live' : phase.status === 'next' ? '◐ Next' : '○ Planned'}
                    </span>
                  </div>
                  <h4 className="dk-roadmap-title">{phase.title}</h4>
                  <ul className="dk-roadmap-list">
                    {phase.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE 9: TEAM & VISION ──────────────────────────────────────────────────

function TeamSlide() {
  return (
    <SlideLayout>
      <SlideHeader
        eyebrow="Vision"
        title="The infrastructure of human activation."
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="dk-body-text dk-body-spacious">
          Ed-Vinci is not a tool. It's a <strong>protocol.</strong>
        </p>
        <p className="dk-body-text dk-body-spacious">
          The long-term vision is to become the underlying activation layer for every person entering the AI economy.
          From individual builders to entire educational institutions. From career changers to corporate teams.
        </p>
        <p className="dk-body-text dk-body-spacious">
          We believe the world doesn't need more information. It needs more activation.
          More people shipping. More people building. More people moving from zero to one.
        </p>

        <div className="dk-vision-pillars">
          {[
            { icon: '🧬', title: 'Identity-First', desc: 'Every user gets a builder identity before a to-do list. This creates intrinsic motivation.' },
            { icon: '🔁', title: 'Systems Over Motivation', desc: 'We don\'t rely on willpower. We build systems where the default action is progress.' },
            { icon: '🌍', title: 'Protocol, Not Product', desc: 'Ed-Vinci is designed to be the activation layer that sits beneath any AI learning or productivity tool.' },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              className="dk-pillar"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
            >
              <span className="dk-pillar-icon">{p.icon}</span>
              <h4 className="dk-pillar-title">{p.title}</h4>
              <p className="dk-pillar-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideLayout>
  );
}

// ─── SLIDE 10: THE ASK ────────────────────────────────────────────────────────

function AskSlide() {
  return (
    <SlideLayout className="dk-slide-ask">
      <DeckOrbs />
      <div className="dk-ask-inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="dk-eyebrow">Join the Journey</span>
          <h2 className="dk-ask-title">
            Your journey from consumer<br />
            <span className="dk-cover-gradient">to builder starts now.</span>
          </h2>
        </motion.div>

        <motion.div
          className="dk-ask-details"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="dk-ask-card">
            <h3 className="dk-ask-card-title">Get Early Access</h3>
            <div className="dk-ask-amount">Become an Active Builder</div>
            <p className="dk-ask-use">
              Join our beta waitlist today. We onboard members in small cohorts to ensure everyone receives personalized AI buddy matching, custom roadmaps, and dedicated accountability support.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="dk-ask-ctas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Link to="/onboarding" className="dk-btn-primary dk-btn-large">
            <span>Try the Product Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/waitlist" className="dk-btn-ghost dk-btn-large">Join the Waitlist</Link>
        </motion.div>

        <motion.div
          className="dk-ask-contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="dk-cover-logo" style={{ marginBottom: 12 }}>
            <span className="dk-logo-icon">◆</span>
            <span className="dk-logo-text">Ed-Vinci</span>
          </div>
          <p className="dk-ask-footer-text">
            Thank you for your time. We'd love to continue this conversation.
          </p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}

// ─── SLIDE REGISTRY ───────────────────────────────────────────────────────────

const SLIDE_COMPONENTS = [
  CoverSlide, ProblemSlide, MarketSlide, InsightSlide, SolutionSlide,
  ProductSlide, StakeholdersSlide, ModelSlide, TractionSlide, TeamSlide, AskSlide,
];

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Deck() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SLIDES.length;

  const goTo = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const prev = useCallback(() => { if (current > 0) goTo(current - 1); }, [current, goTo]);
  const next = useCallback(() => { if (current < total - 1) goTo(current + 1); }, [current, total, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const SlideComponent = SLIDE_COMPONENTS[current];

  return (
    <div className="dk-root">
      {/* Top nav */}
      <motion.div
        className="dk-top-nav"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="dk-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Exit
        </Link>
        <div className="dk-top-nav-actions">
          <button className="dk-btn-ghost dk-btn-small" onClick={() => window.print()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </button>
          <div className="dk-slide-counter">
            <span className="dk-counter-current">{String(current + 1).padStart(2, '0')}</span>
            <span className="dk-counter-divider">/</span>
            <span className="dk-counter-total">{String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </motion.div>

      {/* Print Only Container */}
      <div className="dk-print-container">
        {SLIDE_COMPONENTS.map((Slide, i) => (
          <div key={i} className="dk-print-slide">
            <Slide />
          </div>
        ))}
      </div>

      {/* Slide */}
      <div className="dk-slide-area">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            className="dk-slide-wrapper"
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <motion.div
        className="dk-controls"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="dk-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`dk-dot-btn ${i === current ? 'dk-dot-active' : ''} ${i < current ? 'dk-dot-past' : ''}`}
              onClick={() => goTo(i)}
              title={s.label}
            >
              <span className="dk-dot-label">{s.label}</span>
              <div className="dk-dot-indicator" />
            </button>
          ))}
        </div>
        <div className="dk-nav-arrows">
          <button
            className={`dk-arrow-btn ${current === 0 ? 'dk-arrow-disabled' : ''}`}
            onClick={prev}
            disabled={current === 0}
            title="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className={`dk-arrow-btn dk-arrow-next ${current === total - 1 ? 'dk-arrow-disabled' : ''}`}
            onClick={next}
            disabled={current === total - 1}
            title="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Keyboard hint */}
      <div className="dk-keyboard-hint">
        <kbd>←</kbd> <kbd>→</kbd> or <kbd>Space</kbd> to navigate
      </div>
    </div>
  );
}
