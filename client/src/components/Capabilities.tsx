import { motion } from 'framer-motion';

const ITEMS = [
  {
    title: 'Multimodal reasoning',
    body: 'Text, vision, audio, and structured signals reason in a single context window. No glue code, no brittle adapters.',
    icon: (
      <path d="M3 6h18M3 12h12M3 18h6" strokeLinecap="round" />
    ),
  },
  {
    title: 'Agent runtime',
    body: 'Persistent state, tool calls, parallel branches, replayable traces. Production-grade orchestration baked in.',
    icon: (
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    ),
  },
  {
    title: 'Vector substrate',
    body: 'Hybrid retrieval over 9B+ embeddings with sub-40ms p99. Indexes self-tune to your traffic.',
    icon: (
      <path d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Edge inference',
    body: 'Push models to 230 PoPs worldwide. Cold starts under 80ms. Bring-your-own-weights supported.',
    icon: (
      <path d="M12 2L2 22h20L12 2zM12 9v6M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Evaluation lab',
    body: 'Continuous evals, regression detection, A/B routing across model versions — without leaving the dashboard.',
    icon: (
      <path d="M9 11l3 3 8-8M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Compliance fabric',
    body: 'SOC 2, HIPAA, GDPR, EU AI Act. Per-tenant isolation, signed audit logs, redaction at the I/O boundary.',
    icon: (
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" strokeLinejoin="round" />
    ),
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative bg-ink-900 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-mist">/ capabilities</span>
          <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            One platform. <span className="text-gradient-ai">Every layer of the stack.</span>
          </h2>
          <p className="mt-5 text-white/60">
            From the silicon up to the agent loop, cortex is the substrate teams reach for when intelligence
            stops being a feature and starts being the product.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-ink-900 p-8 transition hover:bg-ink-800"
            >
              <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-glow/20 to-violet-glow/20 ring-1 ring-white/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-mist" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  {item.icon}
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent opacity-0 transition group-hover:opacity-100"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
