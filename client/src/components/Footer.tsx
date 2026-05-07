export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-glow to-violet-glow text-ink-900">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold text-white">cortex</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/40">
            The operating system for the AI age. Built in San Francisco, Zurich, and Singapore.
          </p>
        </div>

        {[
          { title: 'Platform', links: ['Capabilities', 'Models', 'Pricing', 'Changelog'] },
          { title: 'Resources', links: ['Docs', 'Cookbook', 'Research', 'Status'] },
          { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/60 transition hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/5 px-6 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 md:flex-row">
        <span>© 2026 Cortex Labs · all rights reserved</span>
        <span>shipped from a quiet lab somewhere on earth</span>
      </div>
    </footer>
  );
}
