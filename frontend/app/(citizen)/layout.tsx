import { ThemeProvider } from "next-themes";
import { CitizenShell } from "@/components/citizen/shell";
import { Toaster } from "@/components/ui/sonner";

// D35: the citizen app is always light (readable outdoors in sun).
export default function CitizenLayout({ children }: LayoutProps<"/">) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      <div className="flex min-h-dvh flex-col bg-background text-[17px]">
        <CitizenShell>{children}</CitizenShell>
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
