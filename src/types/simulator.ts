export type Frequency = "one-shot" | "daily" | "weekly" | "monthly";

export interface SimulatorFormValues {
  crypto: CryptoAsset;
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
}

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface SimulationResult {
  totalInvested: number;
  tokensAcquired: number;
  averageBuyPrice: number;
  finalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  valeur: number;
  investi: number;
  prix: number;
}
