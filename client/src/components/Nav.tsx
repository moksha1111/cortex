import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Decide visibility on every scroll change. The pattern:
  //  - always visible near the top (scrollY < 80) — avoids flicker on refresh
  //  - hide on downward scroll past a small jitter threshold
  //  - show again the moment the user scrolls up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);

    if (latest < 80) {
      setHidden(false);
    } else if (latest > previous + 6) {
      setHidden(true);
    } else if (latest < previous - 6) {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-110%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink-900/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-glow to-violet-glow text-ink-900">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">cortex</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {['Capabilities', 'Power', 'Models', 'Stories', 'Pricing'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-sm text-white/60 transition hover:text-white md:block">
            Sign in
          </a>
          <a
            href="#waitlist"
            className="rounded-lg bg-gradient-to-r from-cyan-glow to-violet-glow px-4 py-2 text-xs font-semibold text-ink-900 transition hover:brightness-110"
          >
            Get access
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
