import { SOURCES } from "./sources";

export function SourcesList() {
  return (
    <section id="sources" className="mx-auto w-full max-w-6xl border-t border-border px-6 py-12">
      <p className="font-mono text-xs text-muted-foreground">Sources</p>
      <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
        {SOURCES.map((s) => (
          <li key={s.id} id={`source-${s.id}`} className="flex gap-2 scroll-mt-24">
            <span className="tabular font-mono text-xs text-muted-foreground">[{s.id}]</span>
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
