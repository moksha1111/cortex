import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// pool of images dropped along the cursor path — these can be swapped freely
const TRAIL_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=600&auto=format&fit=crop',
];

// distance the cursor must travel before a new image is dropped (px).
// keeps the trail from spawning hundreds of overlapping items on a tiny twitch.
const MIN_DIST = 80;
// how long each dropped image lives before unmounting (ms)
const LIFETIME = 900;
// dropped image dimensions
const IMG_W = 180;
const IMG_H = 120;

interface TrailItem {
  id: number;
  x: number;
  y: number;
  src: string;
  rotate: number;
}

export default function CursorTrail() {
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastPos = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const idRef = useRef(0);
  const imgIdx = useRef(0);

  const handleMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    if (Math.hypot(dx, dy) < MIN_DIST) return; // throttle by distance, not time
    lastPos.current = { x, y };

    const id = ++idRef.current;
    const src = TRAIL_IMAGES[imgIdx.current % TRAIL_IMAGES.length];
    imgIdx.current += 1;
    const rotate = (Math.random() - 0.5) * 30; // ±15° tilt for organic feel

    setItems((prev) => [...prev, { id, x, y, src, rotate }]);
    // schedule removal — exit animation runs first thanks to AnimatePresence
    window.setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }, LIFETIME);
  }, []);

  const handleLeave = useCallback(() => {
    // reset distance tracker so the next entry drops immediately on re-enter
    lastPos.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <section id="trail" className="relative bg-ink-800 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-violet-glow">/ playground</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
              Trace the <span className="text-gradient-ai">substrate.</span>
            </h2>
            <p className="mt-5 text-white/60">
              Drag your cursor across the canvas. Every neuron leaves a trail of light, and the path
              fades back into the dark a second later — like memory.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-mist/70">
            interactive · move pointer
          </span>
        </div>

        <div
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          className="group relative h-[460px] cursor-crosshair overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 md:h-[540px]"
        >
          <div aria-hidden className="absolute inset-0 grid-bg opacity-25" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(34,211,238,0.08),transparent_70%)]"
          />

          <AnimatePresence>
            {items.map((item) => (
              <motion.img
                key={item.id}
                src={item.src}
                alt=""
                draggable={false}
                initial={{ opacity: 0, scale: 0.4, rotate: item.rotate * 0.4 }}
                animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
                exit={{ opacity: 0, scale: 0.7, rotate: item.rotate * 1.5 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  left: item.x - IMG_W / 2,
                  top: item.y - IMG_H / 2,
                  width: IMG_W,
                  height: IMG_H,
                  pointerEvents: 'none',
                  willChange: 'transform, opacity',
                }}
                className="rounded-xl object-cover shadow-2xl shadow-cyan-glow/20 ring-1 ring-white/10"
              />
            ))}
          </AnimatePresence>

          {/* hint shown only when the canvas is idle */}
          {items.length === 0 && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-display text-3xl text-white/30 md:text-4xl">move your cursor</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/20">
                  the substrate is listening
                </div>
              </div>
            </div>
          )}

          {/* corner annotations for instrument-panel feel */}
          <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            cortex.canvas / live
          </div>
          <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-mist/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
            tracing
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            min-step {MIN_DIST}px · lifetime {LIFETIME}ms
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            active · {items.length}
          </div>
        </div>
      </div>
    </section>
  );
}
