import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('engineer');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Something went wrong');
      setStatus('success');
      setMessage(data?.message ?? 'You are on the list.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Network error');
    }
  }

  return (
    <section id="waitlist" className="relative overflow-hidden bg-ink-900 py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(34,211,238,0.12),transparent_70%),radial-gradient(40%_40%_at_70%_30%,rgba(167,139,250,0.18),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-30" />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-mist"
        >
          / early access
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-4 font-display text-4xl font-bold text-white md:text-6xl"
        >
          Be there <span className="text-gradient-ai">when intelligence ships.</span>
        </motion.h2>
        <p className="mt-5 text-white/60">
          We&rsquo;re onboarding teams in waves. Drop your email — we&rsquo;ll send a console invite when your slot opens.
        </p>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.ai"
            className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-cyan-glow/50"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-glow/50"
          >
            <option value="engineer">Engineer</option>
            <option value="founder">Founder</option>
            <option value="research">Research</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow px-6 py-3 text-sm font-semibold text-ink-900 shadow-lg shadow-cyan-glow/30 transition hover:brightness-110 disabled:opacity-60"
          >
            {status === 'loading' ? 'Joining...' : 'Join waitlist'}
          </button>
        </motion.form>

        {status !== 'idle' && status !== 'loading' && (
          <p className={`mt-5 font-mono text-xs uppercase tracking-[0.25em] ${status === 'success' ? 'text-cyan-mist' : 'text-rose-300'}`}>
            {status === 'success' ? '✓ ' : '× '} {message}
          </p>
        )}

        <p className="mt-6 text-xs text-white/30">
          No spam. We send one email when your seat is ready.
        </p>
      </div>
    </section>
  );
}
