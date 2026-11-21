"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Home, LayoutDashboard, LayoutGrid, Mic } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const DESTINATIONS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/report", label: "Citizen app", icon: Mic, match: (p: string) => ["/report", "/ask", "/my-reports", "/language"].includes(p) },
  { href: "/dashboard", label: "Panchayat console", icon: LayoutDashboard, match: (p: string) => p.startsWith("/dashboard") },
] as const;

/** One tap to Home, the citizen app or the panchayat console, from anywhere (for assessors too). */
export function AppSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Go to Home, Citizen app or Panchayat console"
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className,
        )}
      >
        <LayoutGrid className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        {DESTINATIONS.map(({ href, label, icon: Icon, match }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />} className="gap-2.5 py-2">
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            {match(pathname) && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
