"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Globe, LifeBuoy, Phone } from "lucide-react";
import { AppSwitcher } from "@/components/brand/app-switcher";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/i18n";

// Optional panchayat helpline shown on every citizen page (set NEXT_PUBLIC_HELPLINE to display it).
const HELPLINE = process.env.NEXT_PUBLIC_HELPLINE ?? "";

/** Citizen frame: logo (home), language chip, theme toggle, page switcher; help line at the bottom. */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const { language, ready, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const onPicker = pathname === "/language";

  useEffect(() => {
    if (ready && language === null && !onPicker) router.replace("/language");
  }, [ready, language, onPicker, router]);

  const native = LANGUAGES.find((l) => l.id === language)?.native;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-4 pt-4">
      <header className="flex items-center justify-between gap-2">
        <Link href="/" aria-label="Kayal home">
          <Logo markClassName="size-9" />
        </Link>
        <div className="flex items-center gap-1.5">
          {!onPicker && native && (
            <Link
              href="/language"
              className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground"
            >
              <Globe className="size-4" />
              {native}
            </Link>
          )}
          <ThemeToggle />
          <AppSwitcher />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{ready ? children : null}</main>
      {!onPicker && ready && (
        <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
          <Link href="/ask" className="flex items-center gap-1.5 py-1 hover:text-foreground">
            <LifeBuoy className="size-4" /> {t.needHelp}
          </Link>
          {HELPLINE && (
            <a href={`tel:${HELPLINE.replace(/\s/g, "")}`} className="flex items-center gap-1.5 py-1 hover:text-foreground">
              <Phone className="size-4" /> {HELPLINE}
            </a>
          )}
        </footer>
      )}
    </div>
  );
}
