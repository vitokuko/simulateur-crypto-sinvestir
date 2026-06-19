import type { CryptoAsset, PriceDataPoint } from "@/types/simulator";

// Binance kline tuple: [openTime, open, high, low, close, volume, ...]
type BinanceKline = [number, string, string, string, string, string, ...unknown[]];

const BINANCE_BASE = "https://api.binance.com/api/v3";

// Cryptos available as EUR pairs on Binance
export const TOP_CRYPTOS: CryptoAsset[] = [
  { id: "BTCEUR", symbol: "BTC", name: "Bitcoin" },
  { id: "ETHEUR", symbol: "ETH", name: "Ethereum" },
  { id: "BNBEUR", symbol: "BNB", name: "BNB" },
  { id: "SOLEUR", symbol: "SOL", name: "Solana" },
  { id: "XRPEUR", symbol: "XRP", name: "XRP" },
  { id: "ADAEUR", symbol: "ADA", name: "Cardano" },
  { id: "AVAXEUR", symbol: "AVAX", name: "Avalanche" },
  { id: "DOGEEUR", symbol: "DOGE", name: "Dogecoin" },
  { id: "DOTEUR", symbol: "DOT", name: "Polkadot" },
  { id: "LINKEUR", symbol: "LINK", name: "Chainlink" },
  { id: "BCHEUR", symbol: "BCH", name: "Bitcoin Cash" },
  { id: "LTCEUR", symbol: "LTC", name: "Litecoin" },
  { id: "SHIBEUR", symbol: "SHIB", name: "Shiba Inu" },
  { id: "XLMEUR", symbol: "XLM", name: "Stellar" },
  { id: "ATOMEUR", symbol: "ATOM", name: "Cosmos" },
  { id: "NEAREUR", symbol: "NEAR", name: "NEAR Protocol" },
  { id: "VETEUR", symbol: "VET", name: "VeChain" },
  { id: "TRXEUR", symbol: "TRX", name: "TRON" },
  { id: "EGLDEUR", symbol: "EGLD", name: "MultiversX" },
  { id: "ICPEUR", symbol: "ICP", name: "Internet Computer" },
  { id: "POLEUR", symbol: "POL", name: "Polygon" },
  { id: "APTEUR", symbol: "APT", name: "Aptos" },
  { id: "SUIEUR", symbol: "SUI", name: "Sui" },
  { id: "RENDEREUR", symbol: "RENDER", name: "Render" },
  { id: "PEPEEUR", symbol: "PEPE", name: "Pepe" },
];

export function searchCryptos(query: string): CryptoAsset[] {
  if (!query.trim()) return TOP_CRYPTOS;
  const q = query.toLowerCase();
  return TOP_CRYPTOS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
}

export function getAllCryptos(): CryptoAsset[] {
  return TOP_CRYPTOS;
}

async function fetchKlines(
  symbol: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<BinanceKline[]> {
  const url = `${BINANCE_BASE}/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=1000`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    if (res.status === 400) throw new Error("NOT_FOUND");
    throw new Error("API_ERROR");
  }
  return res.json();
}

export async function fetchHistoricalPrices(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<PriceDataPoint[]> {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const diffDays = (endTime - startTime) / (1000 * 60 * 60 * 24);

  const interval = diffDays > 7 ? "1d" : "1h";
  const intervalMs = interval === "1d" ? 86_400_000 : 3_600_000;

  // Paginate: Binance caps at 1000 candles per request
  const allCandles: BinanceKline[] = [];
  let cursor = startTime;

  while (cursor < endTime) {
    const batch = await fetchKlines(symbol, interval, cursor, endTime);
    if (!batch || batch.length === 0) break;
    allCandles.push(...batch);
    const lastOpenTime = batch[batch.length - 1][0];
    cursor = lastOpenTime + intervalMs;
    if (batch.length < 1000) break;
  }

  if (allCandles.length === 0) throw new Error("NO_DATA");

  // Deduplicate by date (keep last close per day)
  const byDate = new Map<string, number>();
  for (const candle of allCandles) {
    const date = new Date(candle[0]).toISOString().split("T")[0];
    byDate.set(date, parseFloat(candle[4])); // close price
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, price]) => ({ date, price }));
}
