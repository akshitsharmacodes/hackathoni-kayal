"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Status } from "@/lib/api";

const POLL = 5_000; // D12 + D43

export const useReports = () => useQuery({ queryKey: ["reports"], queryFn: api.reports, refetchInterval: POLL });
export const useStats = () => useQuery({ queryKey: ["stats"], queryFn: api.stats, refetchInterval: POLL });
export const useGauges = () => useQuery({ queryKey: ["gauges"], queryFn: api.gauges, refetchInterval: 30_000 });
export const useAlerts = () => useQuery({ queryKey: ["alerts"], queryFn: api.alerts, refetchInterval: POLL });
export const usePlaces = () => useQuery({ queryKey: ["places"], queryFn: api.places, staleTime: Infinity });
export const useReport = (id: number | null) =>
  useQuery({ queryKey: ["report", id], queryFn: () => api.report(id!), enabled: id !== null, refetchInterval: POLL });

export function useSetStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number; status: Status; note?: string; duplicate_of?: number }) =>
      api.setStatus(v.id, v.status, v.note, v.duplicate_of),
    onSuccess: () => qc.invalidateQueries(),
  });
}
