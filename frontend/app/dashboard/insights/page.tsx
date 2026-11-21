import { InsightsGrid } from "@/components/dashboard/insights/insights-grid";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <>
      <PageHeader title="Insights" description="Trends across categories, places and time · updates every 5 s" />
      <InsightsGrid />
    </>
  );
}
