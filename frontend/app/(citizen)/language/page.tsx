"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// D31: four big buttons, each written in its own script.
export default function LanguagePage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 py-8">
      <div className="space-y-2 text-center">
        <p className="font-mono text-xs text-muted-foreground">Kayal</p>
        <h1 className="text-[26px] font-semibold leading-snug">
          ഭാഷ തിരഞ്ഞെടുക്കൂ
          <span className="block text-base font-normal text-muted-foreground">Choose your language</span>
        </h1>
      </div>
      <div className="grid gap-3">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => {
              setLanguage(l.id);
              router.push("/report");
            }}
            className={cn(
              "flex h-[72px] items-center justify-between rounded-lg border bg-card px-6 text-left transition-colors active:bg-muted",
              language === l.id ? "border-primary ring-2 ring-primary/15" : "border-border",
            )}
          >
            <span className="text-2xl font-medium">{l.native}</span>
            {language === l.id ? (
              <Check className="size-6 text-primary" />
            ) : (
              <span className="text-sm text-muted-foreground">{l.english !== l.native ? l.english : ""}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
