"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { SimulatorFormInput } from "@/lib/validators/simulator";

export function useUrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushToUrl = useCallback(
    (values: SimulatorFormInput) => {
      const params = new URLSearchParams({
        crypto: values.cryptoId,
        symbol: values.cryptoSymbol,
        name: values.cryptoName,
        amount: String(values.amount),
        freq: values.frequency,
        from: values.startDate,
        to: values.endDate,
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const readFromUrl = useCallback((): Partial<SimulatorFormInput> | null => {
    const crypto = searchParams.get("crypto");
    const symbol = searchParams.get("symbol");
    const name = searchParams.get("name");
    const amount = searchParams.get("amount");
    const freq = searchParams.get("freq");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!crypto || !amount || !freq || !from || !to) return null;

    return {
      cryptoId: crypto,
      cryptoSymbol: symbol ?? crypto,
      cryptoName: name ?? crypto,
      amount: parseFloat(amount),
      frequency: freq as SimulatorFormInput["frequency"],
      startDate: from,
      endDate: to,
    };
  }, [searchParams]);

  return { pushToUrl, readFromUrl };
}
