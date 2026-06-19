import type {
  PriceDataPoint,
  SimulationResult,
  ChartDataPoint,
  Frequency,
} from "@/types/simulator";

function getIntervalDays(frequency: Frequency): number {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    default:
      return 0;
  }
}

function findClosestPrice(prices: PriceDataPoint[], targetDate: string): number {
  const target = new Date(targetDate).getTime();
  let closest = prices[0];
  let minDiff = Math.abs(new Date(prices[0].date).getTime() - target);

  for (const point of prices) {
    const diff = Math.abs(new Date(point.date).getTime() - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }
  return closest.price;
}

export function calculateSimulation(
  prices: PriceDataPoint[],
  amount: number,
  frequency: Frequency,
  startDate: string,
  endDate: string
): SimulationResult {
  if (frequency === "one-shot") {
    return calculateOneShot(prices, amount, startDate, endDate);
  }
  return calculateDCA(prices, amount, frequency, startDate, endDate);
}

function calculateOneShot(
  prices: PriceDataPoint[],
  amount: number,
  startDate: string,
  endDate: string
): SimulationResult {
  const entryPrice = findClosestPrice(prices, startDate);
  const exitPrice = findClosestPrice(prices, endDate);
  const tokensAcquired = amount / entryPrice;
  const finalValue = tokensAcquired * exitPrice;
  const gainLoss = finalValue - amount;
  const gainLossPercent = (gainLoss / amount) * 100;

  const chartData: ChartDataPoint[] = prices.map((p) => {
    const valeur = tokensAcquired * p.price;
    return {
      date: p.date,
      valeur,
      investi: amount,
      gains: Math.max(valeur - amount, 0),
      prix: p.price,
    };
  });

  return {
    totalInvested: amount,
    tokensAcquired,
    averageBuyPrice: entryPrice,
    finalValue,
    gainLoss,
    gainLossPercent,
    chartData,
  };
}

function calculateDCA(
  prices: PriceDataPoint[],
  amountPerPeriod: number,
  frequency: Frequency,
  startDate: string,
  endDate: string
): SimulationResult {
  const intervalDays = getIntervalDays(frequency);
  const start = new Date(startDate);
  const end = new Date(endDate);

  let totalInvested = 0;
  let totalTokens = 0;
  const purchases: { date: string; tokens: number; price: number }[] = [];

  let current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const price = findClosestPrice(prices, dateStr);
    const tokens = amountPerPeriod / price;
    totalInvested += amountPerPeriod;
    totalTokens += tokens;
    purchases.push({ date: dateStr, tokens, price });
    current = new Date(current.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  }

  const averageBuyPrice = totalInvested / totalTokens;

  // Build chart with cumulative data per available price point
  let cumulativeTokens = 0;
  let cumulativeInvested = 0;
  let purchaseIndex = 0;

  const chartData: ChartDataPoint[] = prices.map((p) => {
    while (purchaseIndex < purchases.length && purchases[purchaseIndex].date <= p.date) {
      cumulativeTokens += purchases[purchaseIndex].tokens;
      cumulativeInvested += amountPerPeriod;
      purchaseIndex++;
    }
    const valeur = cumulativeTokens * p.price;
    return {
      date: p.date,
      valeur,
      investi: cumulativeInvested,
      gains: Math.max(valeur - cumulativeInvested, 0),
      prix: p.price,
    };
  });

  const lastPrice = findClosestPrice(prices, endDate);
  const finalValue = totalTokens * lastPrice;
  const gainLoss = finalValue - totalInvested;
  const gainLossPercent = (gainLoss / totalInvested) * 100;

  return {
    totalInvested,
    tokensAcquired: totalTokens,
    averageBuyPrice,
    finalValue,
    gainLoss,
    gainLossPercent,
    chartData,
  };
}
