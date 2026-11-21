import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = { title: "Panchayat console" };

// D35: dashboard is light by default with a dark toggle.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="kayal.dashboard.theme">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-h-dvh bg-background">{children}</SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
