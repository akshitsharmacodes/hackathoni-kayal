import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Insights" };

// Placeholder: Devin ticket A builds the charts here (see docs/devin-tickets.md).
export default function InsightsPage() {
  return (
    <>
      <PageHeader title="Insights" description="Trends across categories, places and time" />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm space-y-3 text-center">
          <BarChart3 className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
          <p className="font-medium">Charts are on their way</p>
          <p className="text-sm text-muted-foreground">Reports per day, by category, by status and top hotspots will appear here.</p>
        </div>
      </div>
    </>
  );
}
