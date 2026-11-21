import { SOURCES } from "./sources";

export function SourcesList() {
  return (
    <section id="sources" className="mx-auto w-full max-w-6xl px-6 pb-16">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Sources</p>
      <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
        {SOURCES.map((s) => (
          <li key={s.id} id={`source-${s.id}`} className="flex gap-2 scroll-mt-24">
            <span className="tabular text-[color:var(--gold)]">[{s.id}]</span>
            <a href={s.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">
              {s.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-muted-foreground">River gauge readings in the demo console are simulated and labelled as such.</p>
    </section>
  );
}
