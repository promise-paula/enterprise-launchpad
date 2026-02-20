const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoPrices {
  bitcoin: { usd: number; usd_24h_change: number };
  blockstack: { usd: number; usd_24h_change: number };
}

export interface MarketChartPoint {
  timestamp: number;
  price: number;
}

let lastPrices: CoinGeckoPrices | null = null;
let lastPriceFetch = 0;
const MIN_INTERVAL_MS = 30_000;

export async function fetchPrices(): Promise<CoinGeckoPrices> {
  const now = Date.now();
  if (lastPrices && now - lastPriceFetch < MIN_INTERVAL_MS) {
    return lastPrices;
  }

  const res = await fetch(
    `${BASE_URL}/simple/price?ids=bitcoin,blockstack&vs_currencies=usd&include_24hr_change=true`
  );

  if (res.status === 429) {
    if (lastPrices) return lastPrices;
    throw new Error('Rate limited by CoinGecko');
  }

  if (!res.ok) {
    if (lastPrices) return lastPrices;
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  const data = await res.json();
  lastPrices = data as CoinGeckoPrices;
  lastPriceFetch = now;
  return lastPrices;
}

const chartCache = new Map<string, { data: MarketChartPoint[]; fetchedAt: number }>();

export async function fetchMarketChart(
  coinId: string,
  days: number | string
): Promise<MarketChartPoint[]> {
  const key = `${coinId}-${days}`;
  const cached = chartCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < MIN_INTERVAL_MS) {
    return cached.data;
  }

  const res = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );

  if (res.status === 429) {
    if (cached) return cached.data;
    throw new Error('Rate limited by CoinGecko');
  }

  if (!res.ok) {
    if (cached) return cached.data;
    throw new Error(`CoinGecko chart API error: ${res.status}`);
  }

  const json = await res.json();
  const points: MarketChartPoint[] = (json.prices as [number, number][]).map(
    ([timestamp, price]) => ({ timestamp, price })
  );

  chartCache.set(key, { data: points, fetchedAt: Date.now() });
  return points;
}
