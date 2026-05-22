import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Landing } from './pages/Landing';
import { Quiz } from './pages/Quiz';
import { Processing } from './pages/Processing';
import { Identity } from './pages/Identity';
import { Path } from './pages/Path';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { Waitlist } from './pages/Waitlist';
import { Deck } from './pages/Deck';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location} key={location.pathname}>
          {/* Landing page is now the root */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          {/* Onboarding experience */}
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Waitlist */}
          <Route path="/waitlist" element={<Waitlist />} />
          {/* Pitch Deck */}
          <Route path="/deck" element={<Deck />} />
          {/* Quiz & processing flow */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/identity" element={<Identity />} />
          <Route path="/path" element={<Path />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
