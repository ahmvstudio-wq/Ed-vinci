import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const stagger = (idx: number) => fadeUp(idx * 0.08);

// ─── ORBS ─────────────────────────────────────────────────────────────────────

function Orbs({ variant = 'default' }: { variant?: 'default' | 'muted' }) {
  const opacity = variant === 'muted' ? 0.6 : 1;
  return (
    <div className="lp-orbs" aria-hidden="true" style={{ opacity }}>
      <motion.div
        className="lp-orb lp-orb-1"
        animate={{ scale: [1, 1.2, 1], x: [0, 35, -15, 0], y: [0, -25, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="lp-orb lp-orb-2"
        animate={{ scale: [1.1, 1, 1.15], x: [0, -20, 10, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="lp-orb lp-orb-3"
        animate={{ scale: [1, 1.15, 1], x: [0, 15, -20, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lp-nav-logo">
        <span className="lp-logo-icon">◆</span>
        <span className="lp-logo-text">Ed-Vinci</span>
      </div>
      <div className="lp-nav-links">
        <a href="#problem" className="lp-nav-link">Problem</a>
        <a href="#market" className="lp-nav-link">Market</a>
        <a href="#how" className="lp-nav-link">Product</a>
        <a href="#who" className="lp-nav-link">Segments</a>
        <a href="#about" className="lp-nav-link">About</a>
        <Link to="/deck" className="lp-nav-link">Investor Deck</Link>
      </div>
      <div className="lp-nav-cta">
        <Link to="/waitlist" className="lp-btn-ghost">Join Waitlist</Link>
        <Link to="/onboarding" className="lp-btn-primary">Try the Demo →</Link>
      </div>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="lp-hero">
      <Orbs />
      <div className="lp-hero-content">
        <motion.div
          className="lp-hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          PRE-SEED · BUILDING IN PUBLIC
          <span className="lp-hero-badge-arrow">›</span>
        </motion.div>

        <motion.h1
          className="lp-hero-title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Stop doomscrolling<br />
          <span className="lp-hero-title-accent">your life away.</span>
        </motion.h1>

        <motion.p
          className="lp-hero-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          Ed-Vinci turns your attention into direction — understanding your personality,
          spotting the skills you're actually built for, and guiding you toward a future
          that feels like yours. Not the algorithm's.
        </motion.p>


        <motion.div
          className="lp-hero-ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/onboarding" className="lp-btn-primary lp-btn-large">
            <span>Experience the Product</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/deck" className="lp-btn-ghost lp-btn-large">View Investor Deck</Link>
        </motion.div>

        {/* Key metrics strip */}
        <motion.div
          className="lp-hero-metrics"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {[
            { value: '4.2B', label: 'AI users by 2027' },
            { value: '<13%', label: 'actually build anything' },
            { value: '$0', label: 'tools solving this' },
          ].map((m) => (
            <div key={m.label} className="lp-hero-metric">
              <span className="lp-hero-metric-value">{m.value}</span>
              <span className="lp-hero-metric-label">{m.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="lp-section" id="problem">
      <motion.div className="lp-section-header" {...fadeUp(0)}>
        <span className="lp-eyebrow">The Problem</span>
        <h2 className="lp-section-title">
          The largest unaddressed gap<br className="lp-br-desktop" /> in the AI economy.
        </h2>
      </motion.div>

      <div className="lp-problem-layout">
        <motion.div className="lp-problem-thesis" {...fadeUp(0.1)}>
          <p className="lp-problem-lead">
            We are in an unprecedented moment. Every major platform, tool, and framework for AI is now accessible
            to anyone with an internet connection. The barrier to entry has collapsed.
          </p>
          <p className="lp-problem-body">
            And yet, the vast majority of people who engage with AI — watch tutorials, read newsletters,
            bookmark tools, follow thought leaders — <strong>never build a single meaningful thing with it.</strong>
          </p>
          <p className="lp-problem-body">
            This is not a content problem. There is more educational AI content than any human could consume.
            This is not a tools problem. The tools are world-class and largely free.
          </p>
          <p className="lp-problem-body lp-problem-emphasis">
            This is a direction, momentum, and accountability problem.
            And nobody is solving it.
          </p>
        </motion.div>

        <div className="lp-problem-cards">
          {[
            {
              icon: '📚',
              title: 'The Tutorial Trap',
              body: 'Users consume an average of 4.7 hours of AI content per week but produce zero output. Learning becomes a substitute for doing. Completion rates for project-based AI courses: 3.2%.',
            },
            {
              icon: '🌀',
              title: 'Paralysis of Abundance',
              body: 'The average person bookmarks 12+ AI tools they never use. Optionality without direction creates analysis paralysis. The more choices available, the less likely action becomes.',
            },
            {
              icon: '🧠',
              title: 'The Identity Gap',
              body: 'People don\'t know what kind of AI builder they are. Without a clear identity — Architect, Creator, Operator, Explorer, Strategist — there\'s no framework for deciding what to build or how to start.',
            },
            {
              icon: '📉',
              title: 'No Accountability Infrastructure',
              body: 'Every productivity tool assumes motivation. But motivation is unreliable. There is no existing system that provides persistent, emotionally intelligent accountability for AI builders.',
            },
          ].map((card, i) => (
            <motion.div key={card.title} className="lp-problem-card" {...stagger(i)}>
              <span className="lp-problem-icon">{card.icon}</span>
              <h3 className="lp-problem-card-title">{card.title}</h3>
              <p className="lp-problem-card-body">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



// ─── HOW IT WORKS (PRODUCT) ───────────────────────────────────────────────────

function ProductSection() {
  return (
    <section className="lp-section" id="how">
      <motion.div className="lp-section-header" {...fadeUp(0)}>
        <span className="lp-eyebrow">The Product</span>
        <h2 className="lp-section-title">
          A four-phase activation protocol.
        </h2>
        <p className="lp-section-sub">
          Ed-Vinci is not a course, not a chatbot, and not a productivity tool.
          It's a complete activation system designed to convert stuck potential into shipped work.
        </p>
      </motion.div>

      <div className="lp-product-phases">
        {[
          {
            phase: '01',
            title: 'Emotional Onboarding',
            subtitle: 'Conversation, not interrogation.',
            body: 'A conversation-first onboarding that uses emotionally intelligent dialogue to understand where you actually are — not where you pretend to be. No quiz fatigue. No interrogation. The system adapts to your tone, energy, and honesty level in real time.',
            tag: '~2 min',
            color: '#4F8EF7',
          },
          {
            phase: '02',
            title: 'Identity & Profile Generation',
            subtitle: 'Your AI Builder Archetype.',
            body: 'Based on the conversation, Ed-Vinci places you into one of five AI builder archetypes: Architect, Operator, Creator, Explorer, or Strategist. Each archetype receives a personalized Momentum Score, 30-Day Roadmap, matched AI Buddy personality, and first execution challenge.',
            tag: 'Instant',
            color: '#7B61FF',
          },
          {
            phase: '03',
            title: 'Momentum Discovery',
            subtitle: 'Visual, gamified, zero-friction.',
            body: 'Instead of more quiz questions, the system uses interactive visual cards, binary choices, energy word selection, and mid-flow insight moments. Every 30-60 seconds, value is given back. The user feels seen, not interrogated. Completion rate target: >85%.',
            tag: '~1 min',
            color: '#E74F9A',
          },
          {
            phase: '04',
            title: '30-Day Execution Loop',
            subtitle: 'Systems over motivation.',
            body: 'Daily micro-challenges calibrated to your archetype and current momentum. An AI Buddy matched to your personality provides accountability without being annoying. No willpower required. The system is designed so that the default action is progress.',
            tag: 'Ongoing',
            color: '#4FC7A0',
          },
        ].map((phase, i) => (
          <motion.div
            key={phase.phase}
            className="lp-phase-card"
            style={{ '--phase-color': phase.color } as React.CSSProperties}
            {...stagger(i)}
          >
            <div className="lp-phase-top">
              <span className="lp-phase-number">{phase.phase}</span>
              <span className="lp-phase-tag">{phase.tag}</span>
            </div>
            <h3 className="lp-phase-title">{phase.title}</h3>
            <p className="lp-phase-subtitle">{phase.subtitle}</p>
            <p className="lp-phase-body">{phase.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Live demo CTA */}
      <motion.div className="lp-demo-cta" {...fadeUp(0.4)}>
        <div className="lp-demo-cta-inner">
          <div>
            <h3 className="lp-demo-cta-title">See it live.</h3>
            <p className="lp-demo-cta-sub">
              The full Phase 1-3 onboarding experience is functional right now.
              Walk through it in under 3 minutes. No signup required.
            </p>
          </div>
          <Link to="/onboarding" className="lp-btn-primary">
            <span>Launch Demo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}



// ─── CTA ──────────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="lp-cta-section">
      <Orbs variant="muted" />
      <motion.div className="lp-cta-content" {...fadeUp(0)}>
        <span className="lp-eyebrow">Get Involved</span>
        <h2 className="lp-cta-title">
          The activation layer is being built.<br />
          <span className="lp-cta-accent">Right now.</span>
        </h2>
        <p className="lp-cta-sub">
          The Phase 1-3 prototype is live. The execution engine is in development.
          If you believe in a world where more people ship and fewer people scroll — we want to hear from you.
        </p>
        <div className="lp-cta-buttons">
          <Link to="/onboarding" className="lp-btn-primary lp-btn-large">
            <span>Try the Product</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/waitlist" className="lp-btn-ghost lp-btn-large">Join the Waitlist</Link>
          <Link to="/deck" className="lp-btn-ghost lp-btn-large">View Full Deck</Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="lp-section" id="about">
      <motion.div className="lp-section-header" {...fadeUp(0)}>
        <span className="lp-eyebrow">The Studio</span>
        <h2 className="lp-section-title">
          Built by operators,<br className="lp-br-desktop" /> not academics.
        </h2>
        <p className="lp-section-sub">
          Ed-Vinci is a product of AHMV Studio — a small, opinionated studio that builds
          tools for people who want to do real things in the real world.
        </p>
      </motion.div>

      <div className="lp-about-layout">
        <motion.div className="lp-about-story" {...fadeUp(0.1)}>
          <p className="lp-problem-lead">
            AHMV Studio was started by a 17-year-old who got tired of watching people
            talk about AI without building anything with it — including himself.
          </p>
          <p className="lp-problem-body">
            Ed-Vinci is the first product out of the studio. Not a pivot. Not a hackathon project.
            A deliberate attempt to solve the problem we kept running into: knowing that AI
            mattered, not knowing what to do with it.
          </p>
          <p className="lp-problem-body">
            The studio sits at the intersection of product design, emotional intelligence, and
            operator execution. We don't believe in building for the sake of building.
            Every feature, every line of copy, every interaction has one job:
            get the user one step closer to shipping something real.
          </p>
          <p className="lp-problem-body lp-problem-emphasis">
            We build lean. We ship fast. We don't stop until it works.
          </p>
        </motion.div>

        <div className="lp-about-cards">
          {[
            {
              icon: '🏗️',
              title: 'Studio-first thinking',
              body: 'Every product we build has a clear outcome it must achieve. No feature creep. No scope bloat. One problem, solved completely.',
            },
            {
              icon: '⚡',
              title: 'Speed as a value',
              body: 'We believe slow products teach slow habits. Ed-Vinci was designed to move — from onboarding to first output in under 30 days.',
            },
            {
              icon: '🎯',
              title: 'Operator mindset',
              body: 'We\'re not researchers or influencers. We\'re builders. The studio exists to produce outcomes, not content about outcomes.',
            },
          ].map((card, i) => (
            <motion.div key={card.title} className="lp-problem-card" {...stagger(i)}>
              <span className="lp-problem-icon">{card.icon}</span>
              <h3 className="lp-problem-card-title">{card.title}</h3>
              <p className="lp-problem-card-body">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

function BlogSection() {
  const posts = [
    {
      tag: 'Activation',
      title: 'Why 87% of people who start learning AI never build a single thing',
      excerpt: 'It\'s not motivation. It\'s not time. It\'s not even skill. The real reason is structural — and it\'s entirely fixable if you know what to look for.',
      readTime: '4 min read',
    },
    {
      tag: 'Product Thinking',
      title: 'The Four Masters Paradox: how more information creates less action',
      excerpt: 'There\'s a well-documented paradox in education: the more you learn, the less you act. Here\'s the mechanism — and how Ed-Vinci was designed to break it.',
      readTime: '6 min read',
    },
    {
      tag: 'Builder Identity',
      title: 'You don\'t need a better tool. You need to know what kind of builder you are.',
      excerpt: 'The AI tool landscape is overwhelming by design. The exit isn\'t finding the right tool — it\'s knowing yourself well enough that the right tool becomes obvious.',
      readTime: '5 min read',
    },
  ];

  return (
    <section className="lp-section lp-section-alt" id="blog">
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <motion.div className="lp-section-header" {...fadeUp(0)}>
          <span className="lp-eyebrow">Thinking Out Loud</span>
          <h2 className="lp-section-title">From the studio.</h2>
          <p className="lp-section-sub">
            Ideas we keep returning to while building Ed-Vinci.
            No newsletter cadence. We write when we have something worth saying.
          </p>
        </motion.div>

        <div className="lp-blog-grid">
          {posts.map((post, i) => (
            <motion.div key={post.title} className="lp-blog-card" {...stagger(i)}>
              <span className="lp-blog-tag">{post.tag}</span>
              <h3 className="lp-blog-title">{post.title}</h3>
              <p className="lp-blog-excerpt">{post.excerpt}</p>
              <div className="lp-blog-footer">
                <span className="lp-blog-read-time">{post.readTime}</span>
                <span className="lp-blog-coming">Coming soon</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="lp-blog-cta" {...fadeUp(0.3)}>
          <p className="lp-blog-cta-text">Want to know when we publish?</p>
          <Link to="/waitlist" className="lp-btn-ghost">Join the waitlist — we\'ll send it there</Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CAREERS ──────────────────────────────────────────────────────────────────

function CareersSection() {
  const roles = [
    {
      title: 'Frontend Engineer',
      type: 'Part-time · Remote',
      desc: 'You care about the gap between how something works and how it feels. You\'ve shipped real UI. You write clean React and you understand why framing and animation are product decisions, not design ones.',
      tags: ['React', 'TypeScript', 'Framer Motion', 'CSS'],
    },
    {
      title: 'Community & Growth Lead',
      type: 'Part-time · Remote',
      desc: 'You\'ve built or been part of a community that actually moved. You understand that growth without retention is noise. You know how to make people feel like they belong to something worth belonging to.',
      tags: ['Community', 'Growth', 'Content', 'Operations'],
    },
  ];

  return (
    <section className="lp-section" id="careers">
      <motion.div className="lp-section-header" {...fadeUp(0)}>
        <span className="lp-eyebrow">Join the Studio</span>
        <h2 className="lp-section-title">
          We\'re building the team<br className="lp-br-desktop" /> that builds what\'s next.
        </h2>
        <p className="lp-section-sub">
          Small team. High standards. Real equity in the outcome.
          If you want to build something that matters to a generation, read on.
        </p>
      </motion.div>

      <div className="lp-careers-grid">
        {roles.map((role, i) => (
          <motion.div key={role.title} className="lp-career-card" {...stagger(i)}>
            <div className="lp-career-header">
              <div>
                <h3 className="lp-career-title">{role.title}</h3>
                <span className="lp-career-type">{role.type}</span>
              </div>
              <a href="mailto:hello@ahmvstudio.com" className="lp-btn-primary" style={{ fontSize: 12, padding: '9px 18px', whiteSpace: 'nowrap' }}>
                Apply
              </a>
            </div>
            <p className="lp-career-desc">{role.desc}</p>
            <div className="lp-career-tags">
              {role.tags.map(tag => (
                <span key={tag} className="lp-career-tag">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="lp-careers-note" {...fadeUp(0.3)}>
        <p>
          Don\'t see your role? If you think you belong here, write to us anyway.
          We care more about how you think than what your CV says.
        </p>
        <a href="mailto:hello@ahmvstudio.com" className="lp-btn-ghost">Say hello →</a>
      </motion.div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-footer-logo">
            <span className="lp-logo-icon">◆</span>
            <span className="lp-logo-text">Ed-Vinci</span>
          </div>
          <p className="lp-footer-tagline">
            Converting the AI generation from consumers to builders.
          </p>
        </div>
        <div className="lp-footer-cols">
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Product</h4>
            <Link to="/onboarding" className="lp-footer-link">Experience Demo</Link>
            <Link to="/waitlist" className="lp-footer-link">Join Waitlist</Link>
            <Link to="/deck" className="lp-footer-link">Investor Deck</Link>
          </div>
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Company</h4>
            <a href="#about" className="lp-footer-link">About</a>
            <a href="#blog" className="lp-footer-link">Blog</a>
            <a href="#careers" className="lp-footer-link">Careers</a>
          </div>
        </div>
      </div>
      <div className="lp-footer-bottom">
        <p className="lp-footer-copy">© 2025 Ed-Vinci. All rights reserved.</p>
        <p className="lp-footer-studio">Built &amp; managed by AHMV Studio</p>
      </div>
    </footer>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Landing() {
  return (
    <div className="lp-root">
      <Nav />
      <Hero />
      <ProblemSection />
      <ProductSection />
      <CtaSection />
      <AboutSection />
      <BlogSection />
      <CareersSection />
      <Footer />
    </div>
  );
}
