"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/i18n";

/** Citizen frame: always light, phone-width, wordmark + language chip. Sends first-time users to the picker. */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const { language, ready } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const onPicker = pathname === "/language";

  useEffect(() => {
    if (ready && language === null && !onPicker) router.replace("/language");
  }, [ready, language, onPicker, router]);

  const native = LANGUAGES.find((l) => l.id === language)?.native;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-5">
      <header className="flex items-center justify-between">
        <Link href="/report" className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-primary">കായൽ</span>
          <span className="text-sm font-medium tracking-wide text-muted-foreground">Kayal</span>
        </Link>
        {!onPicker && native && (
          <Link
            href="/language"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
          >
            <Globe className="size-4" />
            {native}
          </Link>
        )}
      </header>
      <main className="flex flex-1 flex-col">{ready ? children : null}</main>
    </div>
  );
}
