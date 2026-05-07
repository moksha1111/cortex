import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Story {
  id: string;
  kicker: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  read: string;
  image: string;
}

const STORIES: Story[] = [
  {
    id: 'void',
    kicker: 'research',
    title: 'We trained a model on the void.',
    excerpt: 'What happens when the only signal in the dataset is the absence of one.',
    body:
      "Our smallest experiment last winter: a 1.2B parameter model fine-tuned on a corpus of nothing — silence between podcast tracks, blank pages, deleted Slack threads. We expected noise. We got something stranger. The model learned the *shape* of human attention, the negative space around the things people say. It now reasons about silence as a first-class signal.",
    date: '2026 · q2',
    read: '6 min',
    image: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'edge',
    kicker: 'product',
    title: 'Cortex Edge — inference at the speed of intent.',
    excerpt: 'A 7B model that fits in a browser tab and thinks in 8 milliseconds.',
    body:
      "We pruned, distilled, and quantized cortex-flash down to a 1.4GB checkpoint that runs on a phone. Latency: 8ms first-token on an iPhone 17 Pro. The trick was rebuilding the attention kernel against WebGPU directly — no ONNX, no intermediates. It ships next quarter to every plan tier.",
    date: '2026 · q2',
    read: '4 min',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'p99',
    kicker: 'engineering',
    title: 'The 38ms lie — what p99 really measures.',
    excerpt: 'Why your latency dashboard is a comforting fiction, and what to track instead.',
    body:
      "Tail latency is the only latency. We instrumented every hop in the cortex stack and discovered the tail is fractal: p99 of p99 is where the real pain hides. This post is a tour through our internal observability — head-of-line blocking on shared GPU pools, queue starvation under bursty load, and the one weird trick (hint: it's not pre-emption) that bought us 3ms back.",
    date: '2026 · apr',
    read: '11 min',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'soil',
    kicker: 'manifesto',
    title: 'Compute is the new soil.',
    excerpt: 'A short essay on why the next decade will be defined by where you grow your weights.',
    body:
      "Land determined the agricultural age. Coal, the industrial. Capital, the financial. Compute determines this one. Not the chips — those are tools. The *substrate*: the racks, the power, the cooling, the pipelines, the people who tend them. We are agriculturalists of intelligence, and the most fertile soil right now is being claimed quietly, in a few unfashionable cities. We named some of them.",
    date: '2026 · mar',
    read: '8 min',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'attention',
    kicker: 'letter',
    title: 'Why we built our own attention mechanism.',
    excerpt: 'A founders’ letter on the unfashionable choice that defines our roadmap.',
    body:
      "Sliding-window, ring, flash, paged — the literature gives you a buffet, and most teams eat from it. We didn't. Our attention is a custom hybrid we call *banded sparse with prefetch*; it costs us six months we'll never get back, and it's why your prompts feel different on cortex than anywhere else. This is the letter we wrote to our seed investors when they asked, gently, whether this was the right hill.",
    date: '2026 · feb',
    read: '7 min',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop',
  },
  {
    id: 'light',
    kicker: 'field report',
    title: 'From datacenter to dream.',
    excerpt: 'A photo essay shot inside our Chernihiv pod over the course of a single night.',
    body:
      "We sent a small crew to one of our edge pods with film cameras and the goal of capturing what 12 megawatts of inference looks like at 3am. The result is a series we're sharing in full here — the rooms, the racks, the engineers. There is a particular quality of light in a datacenter at night. It is the colour of thinking.",
    date: '2026 · feb',
    read: '3 min',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1400&auto=format&fit=crop',
  },
];

export default function Stories() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = STORIES.find((s) => s.id === activeId) ?? null;

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // body scroll lock while modal is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <section id="stories" className="relative bg-ink-900 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-mist">/ dispatches</span>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
              Notes from the <span className="text-gradient-ai">substrate.</span>
            </h2>
            <p className="mt-5 text-white/60">
              Research, letters, and field reports from the team. Click any capsule to read it.
            </p>
          </div>
          <a href="#" className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-mist transition hover:text-white">
            archive &rarr;
          </a>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s) => (
            <motion.li
              key={s.id}
              layoutId={`card-${s.id}`}
              onClick={() => setActiveId(s.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-ink-800"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <motion.div layoutId={`image-${s.id}`} className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
              </motion.div>

              <div className="space-y-3 p-5">
                <motion.span
                  layoutId={`kicker-${s.id}`}
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-mist"
                >
                  {s.kicker}
                </motion.span>
                <motion.h3
                  layoutId={`title-${s.id}`}
                  className="font-display text-lg font-semibold leading-tight text-white"
                >
                  {s.title}
                </motion.h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-white/55">{s.excerpt}</p>
                <div className="flex items-center justify-between pt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                  <span>{s.date}</span>
                  <span>{s.read}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* MODAL — same `layoutId`s as the source card, so framer-motion morphs
          the image, kicker, and title between the two positions instead of
          cross-fading. The body text just opacity-fades since it has no source. */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveId(null)}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/85 px-4 py-12 backdrop-blur-md md:py-20"
          >
            <motion.article
              layoutId={`card-${active.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-2xl shadow-black/60"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`story-${active.id}-title`}
            >
              <motion.div layoutId={`image-${active.id}`} className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={active.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/40 to-transparent" />
              </motion.div>

              <button
                onClick={() => setActiveId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <div className="space-y-5 p-8 md:p-10">
                <motion.span
                  layoutId={`kicker-${active.id}`}
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-mist"
                >
                  {active.kicker}
                </motion.span>
                <motion.h2
                  id={`story-${active.id}-title`}
                  layoutId={`title-${active.id}`}
                  className="font-display text-3xl font-bold leading-tight text-white md:text-4xl"
                >
                  {active.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.4 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <p className="text-base leading-relaxed text-white/70 md:text-lg">{active.body}</p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    <span>{active.date}</span>
                    <span>{active.read}</span>
                    <span>esc to close</span>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
