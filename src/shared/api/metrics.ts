// Метрики: API для получения количества заявок
export type MetricsPeriod = 'hour' | 'day' | 'week';

export interface OrderCountResponse {
  [isoDateTime: string]: number;
}

// Для dev окружения используем прокси /api в Vite, чтобы обойти CORS
const BASE_URL = '/api';

function buildOrderCountUrl(period: MetricsPeriod): string {
  const url = `${BASE_URL}/metric/order_count?limit=${encodeURIComponent(period)}`;
  return url;
}

export async function fetchOrderCount(
  period: MetricsPeriod,
  options?: { signal?: AbortSignal | null }
): Promise<OrderCountResponse> {
  const url = buildOrderCountUrl(period);
  const resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal ?? null,
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch order_count (${resp.status})`);
  }
  const json = await resp.json();
  // Debug: сырой ответ сервера
  console.debug('[metrics] /metric/order_count raw:', json);
  const data: OrderCountResponse = {};
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    for (const [key, value] of Object.entries(json as Record<string, unknown>)) {
      const n = typeof value === 'number' ? value : Number(value);
      if (Number.isFinite(n)) data[key] = n;
    }
    console.debug('[metrics] normalized object:', data);
    return data;
  }
  if (Array.isArray(json)) {
    for (const entry of json as unknown[]) {
      if (Array.isArray(entry) && entry.length >= 2) {
        const key = String(entry[0]);
        const n = typeof entry[1] === 'number' ? entry[1] : Number(entry[1]);
        if (Number.isFinite(n)) data[key] = n as number;
      } else if (entry && typeof entry === 'object') {
        const obj = entry as Record<string, unknown>;
        for (const [key, value] of Object.entries(obj)) {
          const n = typeof value === 'number' ? value : Number(value);
          if (Number.isFinite(n)) data[key] = n;
        }
      }
    }
    console.debug('[metrics] normalized from array:', data);
    return data;
  }
  throw new Error('Invalid response format for order_count');
}

export function sumOrderCount(data: OrderCountResponse): number {
  let sum = 0;
  for (const value of Object.values(data)) {
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(n)) sum += n;
  }
  return sum;
}


