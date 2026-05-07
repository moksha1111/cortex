import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type Direction = 'right' | 'left';

interface Model {
  name: string;
  tier: 'frontier' | 'fast' | 'multimodal' | 'edge';
  params: string;
  context: string;
  speed: string;
  lines: string[];
}

const MODELS: Model[] = [
  {
    name: 'cortex-prime',
    tier: 'frontier',
    params: '405B',
    context: '1M tokens',
    speed: '180 tok/s',
    lines: [
      'Reasons across million-token contexts.',
      'Reads code, runs proofs, files patents.',
      'The model you point at the hard problem.',
    ],
  },
  {
    name: 'cortex-flash',
    tier: 'fast',
    params: '70B',
    context: '256K',
    speed: '720 tok/s',
    lines: [
      'Sub-second first token, every time.',
      'Built for voice, support, and live agents.',
      'Streams faster than your network can deliver.',
    ],
  },
  {
    name: 'cortex-vision',
    tier: 'multimodal',
    params: '32B',
    context: '128K',
    speed: '410 tok/s',
    lines: [
      'Sees PDFs, photos, video, sketches.',
      'Reads tables, signs, handwriting, diagrams.',
      'One context window, every modality.',
    ],
  },
  {
    name: 'cortex-edge',
    tier: 'edge',
    params: '7B',
    context: '64K',
    speed: '1.4k tok/s',
    lines: [
      'Runs in the browser tab you are reading this in.',
      '240MB on disk, 8ms first token.',
      'Bring intelligence anywhere — even offline.',
    ],
  },
];

const TIER_STYLES: Record<Model['tier'], string> = {
  frontier:   'from-violet-glow/40 to-cyan-glow/20 text-violet-glow',
  fast:       'from-cyan-glow/40 to-cyan-mist/20 text-cyan-mist',
  multimodal: 'from-violet-glow/30 to-violet-deep/20 text-violet-glow',
  edge:       'from-cyan-glow/30 to-violet-glow/20 text-cyan-mist',
};

// Travel distance (px) the card slides through. Bigger = more dramatic.
const SLIDE = 320;

function ModelCard({ model, index, direction }: { model: Model; index: number; direction: Direction }) {
  const ref = useRef<HTMLElement>(null);

  // Card-local scroll progress: 0 when the card's top is just below the
  // viewport (95% down), 1 when it has risen to ~50% of the viewport.
  // Because x is bound to this progress, scrolling DOWN drives the card
  // into place and scrolling UP reverses it — naturally bidirectional.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.5'],
  });

  // direction === 'right' → card starts off-screen right (+SLIDE) and slides left to 0.
  // direction === 'left'  → card starts off-screen left  (-SLIDE) and slides right to 0.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [direction === 'right' ? SLIDE : -SLIDE, 0]
  );
  // gentle opacity fade so the card doesn't appear out of nowhere mid-slide
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <motion.article
      ref={ref}
      style={{ x, opacity, willChange: 'transform, opacity' }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 p-7 transition hover:border-cyan-glow/30"
    >
      <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${TIER_STYLES[model.tier]} opacity-30 blur-3xl transition group-hover:opacity-60`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <span className={`inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] ring-1 ring-white/10 ${TIER_STYLES[model.tier]}`}>
            {model.tier}
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold text-white">{model.name}</h3>

          <div className="mt-3 max-w-md space-y-1.5 text-sm leading-relaxed text-white/60">
            {model.lines.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        </div>
        <span className="ml-4 font-mono text-[10px] text-white/30">0{index + 1}</span>
      </div>

      <dl className="relative mt-7 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">params</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-white">{model.params}</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">context</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-white">{model.context}</dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">speed</dt>
          <dd className="mt-1 font-display text-lg font-semibold text-white">{model.speed}</dd>
        </div>
      </dl>
    </motion.article>
  );
}

export default function Models() {
  return (
    // overflow-hidden so the off-screen slide-start positions don't trigger
    // horizontal page scroll while the cards are still travelling in.
    <section id="models" className="relative overflow-hidden bg-ink-800 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-mist">/ models</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
              Pick your <span className="text-gradient-ai">brain.</span>
            </h2>
            <p className="mt-4 text-white/60">
              Four families, one API. Switch with a single string — your prompts, evals, and tools come along.
            </p>
          </div>
          <a href="#" className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-mist transition hover:text-white">
            full model card &rarr;
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {MODELS.map((m, i) => (
            <ModelCard
              key={m.name}
              model={m}
              index={i}
              // top row (index 0, 1) → enter from right. bottom row (2, 3) → from left.
              direction={i < 2 ? 'right' : 'left'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
