import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useRef, type CSSProperties, type MouseEvent } from 'react';

const STATS = [
  { value: '1.42M', label: 'tokens / second' },
  { value: '38ms',  label: 'p99 latency' },
  { value: '230',   label: 'edge regions' },
  { value: '99.99%',label: 'uptime SLA' },
];

export default function Power() {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // scroll-driven parallax (existing)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  // mouse-driven tilt — normalized cursor position [-0.5, 0.5] on each axis
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // spring-smooth so the tilt eases toward the cursor instead of snapping
  const mxSpring = useSpring(mouseX, { stiffness: 200, damping: 22, mass: 0.6 });
  const mySpring = useSpring(mouseY, { stiffness: 200, damping: 22, mass: 0.6 });
  // map cursor position → tilt angle. Positive mouseX (right of centre) → rotate Y to face right.
  const rotateY = useTransform(mxSpring, [-0.5, 0.5], [-14, 14]);
  // invert Y: cursor above centre tilts the card toward viewer (rotateX positive looks down at the card)
  const rotateX = useTransform(mySpring, [-0.5, 0.5], [10, -10]);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const yN = (e.clientY - rect.top) / rect.height;
    mouseX.set(x - 0.5);
    mouseY.set(yN - 0.5);
    // also drive CSS variables for the spotlight gradients (cheaper than motion values)
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${yN * 100}%`);
  }, [mouseX, mouseY]);

  const handleLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
    }
  }, [mouseX, mouseY]);

  return (
    <section id="power" className="relative overflow-hidden bg-ink-900 py-28">
      <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-20" />

      <div ref={ref} className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet-glow">/ the power of AI</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Intelligence,
            <br />
            <span className="text-gradient-ai">measured in light.</span>
          </h2>
          <p className="mt-6 text-white/60">
            We rebuilt the stack from the kernel scheduler to the attention head. The result: models that
            respond before you finish blinking, scale before you finish your coffee, and reason about
            problems your spreadsheet can&rsquo;t spell.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <dt className="font-display text-3xl font-bold text-gradient-ai md:text-4xl">{s.value}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{s.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Mouse-reactive orbital card.
            - rotateX/rotateY tilt toward the cursor (3D card-hover effect)
            - --mx / --my CSS vars drive a radial spotlight that follows the cursor
            - existing y/rotate (scroll-driven parallax) still compose on top */}
        <motion.div
          style={{
            y,
            rotate,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            transformPerspective: 1000,
          }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative"
        >
          <div
            ref={cardRef}
            style={{ ['--mx' as string]: '50%', ['--my' as string]: '50%' } as CSSProperties}
            className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-700 to-ink-900 p-1"
          >
            <div className="absolute inset-0 grid-bg opacity-30" />

            {/* CURSOR SPOTLIGHT — large soft cyan glow that follows the cursor */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  'radial-gradient(320px circle at var(--mx) var(--my), rgba(34,211,238,0.22), transparent 65%)',
              }}
            />
            {/* CURSOR HIGHLIGHT — tighter violet hotspot for a "wet glass" feel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-plus-lighter"
              style={{
                background:
                  'radial-gradient(140px circle at var(--mx) var(--my), rgba(167,139,250,0.30), transparent 60%)',
              }}
            />

            <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translateZ(40px)' }}>
              <div className="relative h-72 w-72">
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-cyan-glow/20" />
                <div className="absolute inset-6 animate-spin-slow rounded-full border border-violet-glow/30" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-12 animate-spin-slow rounded-full border border-cyan-mist/20" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-24 w-24 animate-pulse-slow rounded-full bg-gradient-to-br from-cyan-glow to-violet-glow shadow-[0_0_80px_rgba(34,211,238,0.6)]" />
                </div>
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <span
                    key={deg}
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                    style={{ transform: `rotate(${deg}deg) translateY(-140px)` }}
                  />
                ))}
              </div>
            </div>

            {/* CURSOR-FOLLOWING RIM HIGHLIGHT — thin border light at the cursor edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background:
                  'radial-gradient(60px circle at var(--mx) var(--my), rgba(255,255,255,0.10), transparent 70%)',
              }}
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span>cortex.core / runtime</span>
              <span className="text-cyan-mist">● synced</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
