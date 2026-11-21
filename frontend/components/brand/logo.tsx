import { cn } from "@/lib/utils";

export const TAGLINE = "Your voice. Our waters. Together.";

/**
 * Kayal mark: a lamp flame (nilavilakku: care, hope, a voice) above two backwater waves,
 * on backwater teal. Hand-made SVG so it stays crisp at any size and in dark mode.
 */
export function LogoMark({ className, title = "Kayal" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8 shrink-0", className)} role="img" aria-label={title}>
      <rect width="64" height="64" rx="16" fill="#0E5E5A" />
      <path d="M32 9c-6.5 9-9.5 14.6-9.5 19.4a9.5 9.5 0 0 0 19 0C41.5 23.6 38.5 18 32 9z" fill="#D9A93F" />
      <path d="M32 19.5c-2.6 4-3.9 6.6-3.9 8.8a3.9 3.9 0 0 0 7.8 0c0-2.2-1.3-4.8-3.9-8.8z" fill="#FBF3DE" />
      <path d="M11 45c5.2-4.2 10.4-4.2 15.6 0s10.4 4.2 15.6 0 10.4-4.2 15.6 0" fill="none" stroke="#FBF3DE" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M15 53.5c4.3-3.3 8.6-3.3 12.9 0s8.6 3.3 12.9 0 8.6-3.3 12.9 0" fill="none" stroke="#D9A93F" strokeWidth="3" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

/** Mark + "കായൽ Kayal" wordmark, optionally with the tagline. */
export function Logo({
  className,
  markClassName,
  tagline = false,
  compact = false,
}: {
  className?: string;
  markClassName?: string;
  tagline?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="flex items-baseline gap-1.5">
            <span lang="ml" className="text-lg font-semibold tracking-tight text-primary">കായൽ</span>
            <span className="text-sm font-semibold tracking-wide text-foreground/80">Kayal</span>
          </span>
          {tagline && <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">{TAGLINE}</span>}
        </span>
      )}
    </span>
  );
}
