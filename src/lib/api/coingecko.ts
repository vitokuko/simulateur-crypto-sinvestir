import type { CryptoAsset, PriceDataPoint } from "@/types/simulator";

const BASE_URL = "https://api.coingecko.com/api/v3";

const TOP_50_CRYPTOS: CryptoAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin" },
  { id: "staked-ether", symbol: "STETH", name: "Lido Staked Ether" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash" },
  { id: "stellar", symbol: "XLM", name: "Stellar" },
  { id: "monero", symbol: "XMR", name: "Monero" },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos" },
  { id: "ethereum-classic", symbol: "ETC", name: "Ethereum Classic" },
  { id: "okb", symbol: "OKB", name: "OKB" },
  { id: "filecoin", symbol: "FIL", name: "Filecoin" },
  { id: "hedera-hashgraph", symbol: "HBAR", name: "Hedera" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol" },
  { id: "vechain", symbol: "VET", name: "VeChain" },
  { id: "algorand", symbol: "ALGO", name: "Algorand" },
  { id: "the-sandbox", symbol: "SAND", name: "The Sandbox" },
  { id: "decentraland", symbol: "MANA", name: "Decentraland" },
  { id: "aave", symbol: "AAVE", name: "Aave" },
  { id: "theta-token", symbol: "THETA", name: "Theta Network" },
  { id: "elrond-erd-2", symbol: "EGLD", name: "MultiversX" },
  { id: "axie-infinity", symbol: "AXS", name: "Axie Infinity" },
  { id: "tezos", symbol: "XTZ", name: "Tezos" },
  { id: "eos", symbol: "EOS", name: "EOS" },
  { id: "iota", symbol: "MIOTA", name: "IOTA" },
  { id: "neo", symbol: "NEO", name: "NEO" },
  { id: "pancakeswap-token", symbol: "CAKE", name: "PancakeSwap" },
  { id: "maker", symbol: "MKR", name: "Maker" },
  { id: "compound-governance-token", symbol: "COMP", name: "Compound" },
  { id: "curve-dao-token", symbol: "CRV", name: "Curve DAO" },
  { id: "yearn-finance", symbol: "YFI", name: "yearn.finance" },
  { id: "sushi", symbol: "SUSHI", name: "SushiSwap" },
  { id: "1inch", symbol: "1INCH", name: "1inch" },
  { id: "enjincoin", symbol: "ENJ", name: "Enjin Coin" },
  { id: "basic-attention-token", symbol: "BAT", name: "Basic Attention Token" },
  { id: "chiliz", symbol: "CHZ", name: "Chiliz" },
  { id: "gala", symbol: "GALA", name: "Gala" },
];

export function searchCryptos(query: string): CryptoAsset[] {
  if (!query.trim()) return TOP_50_CRYPTOS;
  const q = query.toLowerCase();
  return TOP_50_CRYPTOS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
}

export function getAllCryptos(): CryptoAsset[] {
  return TOP_50_CRYPTOS;
}

export async function fetchHistoricalPrices(
  cryptoId: string,
  startDate: string,
  endDate: string
): Promise<PriceDataPoint[]> {
  const from = Math.floor(new Date(startDate).getTime() / 1000);
  const to = Math.floor(new Date(endDate).getTime() / 1000);

  const url = `${BASE_URL}/coins/${encodeURIComponent(cryptoId)}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (res.status === 404) throw new Error("NOT_FOUND");
    throw new Error("API_ERROR");
  }

  const data = await res.json();
  const prices: [number, number][] = data.prices ?? [];

  if (prices.length === 0) throw new Error("NO_DATA");

  return prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString().split("T")[0],
    price,
  }));
}
