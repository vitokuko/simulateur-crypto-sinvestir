"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalPrices } from "@/lib/api/binance";

export function useHistoricalPrices(
  cryptoId: string,
  startDate: string,
  endDate: string,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["prices", cryptoId, startDate, endDate],
    queryFn: () => fetchHistoricalPrices(cryptoId, startDate, endDate),
    enabled: enabled && !!cryptoId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "RATE_LIMIT") return false;
      if (error instanceof Error && error.message === "NOT_FOUND") return false;
      return failureCount < 2;
    },
  });
}
