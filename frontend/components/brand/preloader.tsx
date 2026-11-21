import { TAGLINE } from "./logo";

/**
 * Nilavilakku preloader: the brass lamp outline draws in, its flames light with a soft glow,
 * then the page fades in. Pure CSS (see globals.css "Preloader") so it shows before JavaScript
 * loads; an inline script in the root layout hides it after the first view in a browser session.
 * Skipped entirely for prefers-reduced-motion.
 */
export function Preloader() {
  return (
    <div className="kayal-preloader" aria-hidden>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 120 170" className="h-36 w-auto" fill="none" stroke="#B8892B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <ellipse className="pl-glow" cx="60" cy="74" rx="46" ry="30" fill="#E7B54A" stroke="none" />
          {/* flames on the bowl rim */}
          <path className="pl-flame" d="M30 80c-3-5-4-8-4-10.5a4 4 0 0 1 8 0c0 2.5-1 5.5-4 10.5z" fill="#E9A23B" stroke="none" />
          <path className="pl-flame pl-flame-2" d="M60 66c-4-7-5.5-11-5.5-14.5a5.5 5.5 0 0 1 11 0C65.5 55 64 59 60 66z" fill="#E9A23B" stroke="none" />
          <path className="pl-flame pl-flame-3" d="M90 80c-3-5-4-8-4-10.5a4 4 0 0 1 8 0c0 2.5-1 5.5-4 10.5z" fill="#E9A23B" stroke="none" />
          {/* lamp */}
          <path className="pl-draw" pathLength={1} d="M24 84h72c-4 12-20 18-36 18s-32-6-36-18z" />
          <path className="pl-draw" pathLength={1} d="M60 102v34M50 116h20M52 128h16" />
          <path className="pl-draw" pathLength={1} d="M36 160h48M42 160c2-12 34-12 36 0M50 148c3-6 17-6 20 0" />
          <path className="pl-draw" pathLength={1} d="M60 84V72" />
        </svg>
        <p lang="ml" className="pl-brand mt-4 text-2xl font-semibold tracking-tight text-[#1E5B3A] dark:text-[#46A758]">
          കായൽ <span className="text-base font-medium text-[#6B7280]">Kayal</span>
        </p>
        <p className="pl-brand mt-1 text-xs tracking-wide text-[#6B7280]">{TAGLINE}</p>
      </div>
    </div>
  );
}

/** Runs before paint: hide the preloader if it was already shown in this browser session. */
export const PRELOADER_SCRIPT = `try{if(sessionStorage.getItem('kayal.preloaded')){document.documentElement.setAttribute('data-preloaded','')}else{sessionStorage.setItem('kayal.preloaded','1')}}catch(e){}`;
