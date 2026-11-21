import { MapView } from "@/components/dashboard/map-view";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Map" };

export default function DashboardMapPage() {
  return (
    <>
      <PageHeader title="Live map" description="Citizen reports across the Alappuzha backwaters · updates every 5 s" />
      <MapView />
    </>
  );
}
