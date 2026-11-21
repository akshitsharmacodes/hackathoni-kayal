import { CitizenShell } from "@/components/citizen/shell";
import { Toaster } from "@/components/ui/sonner";

// Theme now follows the device site-wide (root layout); the citizen app no longer forces light mode.
export default function CitizenLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex min-h-dvh flex-col bg-background text-[17px]">
        <CitizenShell>{children}</CitizenShell>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
