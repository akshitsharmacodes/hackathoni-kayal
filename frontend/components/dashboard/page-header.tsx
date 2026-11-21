import { SidebarTrigger } from "@/components/ui/sidebar";

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger aria-label="Collapse or expand the sidebar (Ctrl/Cmd + B)" />
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
