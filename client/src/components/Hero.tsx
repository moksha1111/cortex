import { useRef } from 'react';
import {
  motion,
  wrap,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

interface PlaneItem {
  id: string;
  src: string;
  caption: string;
  tag: string;
}

const PLANES: PlaneItem[] = [
  { id: 'p1', src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop', caption: 'silicon · the substrate', tag: 'compute' },
  { id: 'p2', src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=900&auto=format&fit=crop', caption: 'neural · synthetic minds',  tag: 'inference' },
  { id: 'p3', src: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=900&auto=format&fit=crop', caption: 'cortex · the core',          tag: 'runtime' },
  { id: 'p4', src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=900&auto=format&fit=crop', caption: 'fabric · light over copper', tag: 'transport' },
  { id: 'p5', src: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=900&auto=format&fit=crop', caption: 'embeddings · 9.1B vectors', tag: 'memory' },
  { id: 'p6', src: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=900&auto=format&fit=crop', caption: 'datacenter · the body',     tag: 'fleet' },
  { id: 'p7', src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=900&auto=format&fit=crop', caption: 'racks · the heart of it',   tag: 'edge' },
  { id: 'p8', src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900&auto=format&fit=crop', caption: 'circuits · 7nm geometry',  tag: 'silicon' },
  { id: 'p9', src: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=900&auto=format&fit=crop', caption: 'energy · trained on light', tag: 'power' },
];

const PLANE_W = 320;
const PLANE_H = 380;
const GAP = 28;
const STEP = PLANE_W + GAP;                    // px each plane occupies on the track
const LOOP_WIDTH = PLANES.length * STEP;       // length of one full set
const STRIP = [...PLANES, ...PLANES];          // doubled for seamless wrap

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // 1) page scroll position
  const { scrollY } = useScroll();
  // 2) instantaneous vertical velocity (px/sec) — sign tracks wheel direction
  const scrollVelocity = useVelocity(scrollY);
  // 3) spring-smoothed velocity → elastic feel on direction changes
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 });

  // accumulated horizontal offset (px). Wheel down (v>0) grows baseX,
  // wheel up (v<0) shrinks it — direction reverses with the wheel.
  const baseX = useMotionValue(0);
  const lastTs = useRef<number>(performance.now());

  useMotionValueEvent(smoothVelocity, 'change', (v) => {
    if (prefersReducedMotion) return;
    const now = performance.now();
    const dt = Math.min((now - lastTs.current) / 1000, 0.1);
    lastTs.current = now;
    const RATE = isMobile ? 0.18 : 0.32; // px of horizontal travel per (px/sec) scroll
    baseX.set(baseX.get() + v * dt * RATE);
  });

  // wrap baseX into [0, LOOP_WIDTH) and negate so the strip slides leftward
  // as baseX grows. Because the strip is doubled, the seam is invisible.
  const stripX = useTransform(baseX, (v) => -wrap(0, LOOP_WIDTH, v));

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink-900 text-white"
    >
      <div aria-hidden className="absolute inset-0 -z-20 grid-bg opacity-40" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.18),transparent_70%),radial-gradient(40%_40%_at_80%_30%,rgba(167,139,250,0.18),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full
                   bg-gradient-to-br from-cyan-glow/20 via-violet-glow/10 to-transparent blur-3xl animate-pulse-slow"
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-12 pt-28 md:pt-40">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/5 px-4 py-1.5
                     font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-mist"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
          v4.1 · neural runtime now generally available
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 text-center font-display font-bold tracking-tight"
        >
          <span className="block text-5xl text-white md:text-7xl lg:text-8xl">
            The operating system
          </span>
          <span className="mt-2 block text-gradient-ai text-5xl md:text-7xl lg:text-8xl">
            for the AI age.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 max-w-2xl text-center text-lg text-white/60 md:text-xl"
        >
          Build, deploy, and scale intelligence at planet scale. One runtime, every model, every modality —
          stitched together by a substrate engineered for thinking machines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#waitlist"
            className="rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow px-7 py-3.5 text-sm font-semibold
                       text-ink-900 shadow-lg shadow-cyan-glow/30 transition hover:brightness-110"
          >
            Request early access
          </a>
          <a
            href="#capabilities"
            className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/10"
          >
            See the platform &rarr;
          </a>
        </motion.div>
      </div>

      {/* Horizontal scroll-linked carousel.
          The strip is one big motion.div whose `x` is driven by accumulated
          scroll velocity. Each plane sits at a static `left: index * STEP`
          inside the strip — no per-plane transforms, so nothing competes
          with framer's transform composition. The doubled strip + `wrap`
          gives a seamless infinite loop in both directions. */}
      <div
        aria-hidden
        className="relative h-[440px] w-full overflow-hidden md:h-[500px]"
        style={{ perspective: isMobile ? 'none' : '1400px' }}
      >
        <motion.div
          style={{
            x: stripX,
            willChange: 'transform',
          }}
          className="relative h-full"
        >
          {STRIP.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              style={{
                position: 'absolute',
                left: i * STEP,
                top: '50%',
                width: PLANE_W,
                height: PLANE_H,
                marginTop: -PLANE_H / 2,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-glow/10">
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/70 via-violet-deep/20 to-cyan-glow/15 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900/90" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/80">{p.tag}</span>
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-mist/80">
                    cortex / plane {String((i % PLANES.length) + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-1 font-display text-base font-semibold text-white">{p.caption}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-900 to-transparent md:w-64" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-900 to-transparent md:w-64" />
      </div>

      <p className="mx-auto -mt-2 mb-12 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
        scroll · wheel down → row slides left · wheel up → reverses
      </p>
    </section>
  );
}
