// Метрики: API для получения количества заявок
export type MetricsPeriod = 'hour' | 'day' | 'week';

export interface Executor {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  order_count: number;
  parameters: Array<{
    id: number;
    mask: string;
  }> | null;
}

export interface OrderCountDataPoint {
  ts: string;
  count: number;
}

export type OrderCountResponse = OrderCountDataPoint[];

export interface CreateExecutorRequest {
  name: string;
  status: 'active' | 'inactive';
  parameters: Array<{
    id: number;
    mask: string;
  }>;
}

export interface CreateExecutorResponse {
  id: number;
}

export interface Parameter {
  id: number;
  name: string;
  type: 'int' | 'datetime' | 'float' | 'text' | 'bool';
}

export interface CreateParameterRequest {
  name: string;
  type: 'int' | 'datetime' | 'float' | 'text' | 'bool';
}

export interface CreateParameterResponse {
  id: number;
}

export interface TotalOrderCountResponse {
  count: number;
}

export interface CompleteOrderCountResponse {
  count: number;
}

export interface ExecutorOrdersItem {
  id?: number;
  name?: string;
  executor_id?: number;
  executor_name?: string;
  orders?: number;
  count?: number;
}

export type ExecutorOrdersResponse = ExecutorOrdersItem[];

// Для dev окружения используем прокси /api в Vite, чтобы обойти CORS
const BASE_URL = '/api';
const EXECUTORS_BASE_URL = '/executors-api';

function buildOrderCountUrl(period: MetricsPeriod): string {
  const url = `${BASE_URL}/metric/order_count_limit?limit=${encodeURIComponent(period)}`;
  return url;
}

export async function fetchOrderCount(
  period: MetricsPeriod,
  options?: { signal?: AbortSignal | null }
): Promise<OrderCountResponse> {
  const url = buildOrderCountUrl(period);
  
  console.log('=== PERIOD BUTTON DEBUG ===');
  console.log('Selected period:', period);
  console.log('Built URL:', url);
  console.log('BASE_URL:', BASE_URL);
  console.log('Full request URL:', url);
  console.log('==========================');
  
  let resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal ?? null,
  });

  // Fallback: если эндпоинт не найден, пробуем альтернативный путь
  if (resp.status === 404) {
    const altUrl = `${BASE_URL}/metric/order_count?limit=${encodeURIComponent(period)}`;
    console.warn(`[metrics] order_count_limit 404, trying fallback: ${altUrl}`);
    resp = await fetch(altUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: options?.signal ?? null,
    });
  }

  if (!resp.ok) {
    throw new Error(`Failed to fetch order_count (${resp.status})`);
  }
  const json = await resp.json();
  // Debug: сырой ответ сервера
  console.debug('[metrics] /metric/order_count raw:', json);
  
  // Новый формат: массив объектов с ts и count
  if (Array.isArray(json)) {
    const data: OrderCountResponse = [];
    for (const item of json) {
      if (item && typeof item === 'object' && 'ts' in item && 'count' in item) {
        const ts = String(item.ts);
        const count = typeof item.count === 'number' ? item.count : Number(item.count);
        if (Number.isFinite(count)) {
          data.push({ ts, count });
        }
      }
    }
    console.debug('[metrics] normalized new format:', data);
    return data;
  }
  
  // Старый формат: объект с ключами-временными метками
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    const data: OrderCountResponse = [];
    for (const [key, value] of Object.entries(json as Record<string, unknown>)) {
      const count = typeof value === 'number' ? value : Number(value);
      if (Number.isFinite(count)) {
        data.push({ ts: key, count });
      }
    }
    console.debug('[metrics] normalized old format:', data);
    return data;
  }
  
  throw new Error('Invalid response format for order_count');
}

export function sumOrderCount(data: OrderCountResponse): number {
  let sum = 0;
  for (const item of data) {
    const count = typeof item.count === 'number' ? item.count : Number(item.count);
    if (Number.isFinite(count)) sum += count;
  }
  return sum;
}

/**
 * Парсит маску обратно в операцию и значения
 * "20x" -> { operation: '>', value: '20' }
 * "x20" -> { operation: '<', value: '20' }
 * "20" -> { operation: '=', value: '20' }
 * "20x30" -> { operation: '<x<', minValue: '20', maxValue: '30' }
 */
export function parseMaskToOperation(mask: string): {
  operation: '>' | '<' | '=' | '<x<';
  value?: string;
  minValue?: string;
  maxValue?: string;
} {
  if (!mask || typeof mask !== 'string') {
    return { operation: '=', value: '' };
  }

  // Диапазон: "20x30"
  if (mask.includes('x') && mask.split('x').length === 2) {
    const parts = mask.split('x');
    const minValue = parts[0];
    const maxValue = parts[1];
    
    if (minValue && maxValue) {
      return { operation: '<x<', minValue, maxValue };
    }
  }

  // Больше: "20x"
  if (mask.endsWith('x') && !mask.startsWith('x')) {
    const value = mask.slice(0, -1);
    return { operation: '>', value };
  }

  // Меньше: "x20"
  if (mask.startsWith('x') && !mask.endsWith('x')) {
    const value = mask.slice(1);
    return { operation: '<', value };
  }

  // Равно: "20"
  return { operation: '=', value: mask };
}


// Параметры: получение списка всех параметров
export async function fetchParameters(): Promise<Parameter[]> {
  // Используем прямой URL если BASE_URL не работает
  const baseUrl = BASE_URL || '/api';
  const url = `${baseUrl}/parameters`;
  
  try {
    // Добавляем таймаут
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000); // 5 секунд таймаут
    
    const resp = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!resp.ok) {
      throw new Error(`Failed to fetch parameters (${resp.status})`);
    }
    
    const json = await resp.json();
    if (!Array.isArray(json)) {
      throw new Error('Invalid response format for parameters');
    }
    return json as Parameter[];
  } catch {
    // Временная заглушка для тестирования
    console.log('Using fallback parameters - server not responding');
    
    // Пытаемся загрузить из localStorage
    const stored = localStorage.getItem('fallbackParameters');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as Parameter[];
        }
      } catch {
        // Если не удалось распарсить, используем дефолтные
      }
    }
    
    // Дефолтные параметры
    const fallbackParameters: Parameter[] = [
      { id: 1, name: 'Параметр 1', type: 'int' },
      { id: 2, name: 'Параметр 2', type: 'text' },
      { id: 3, name: 'Параметр 3', type: 'float' },
      { id: 4, name: 'Параметр 4', type: 'bool' },
      { id: 5, name: 'Параметр 5', type: 'datetime' },
      { id: 6, name: 'Параметр 6', type: 'int' },
      { id: 7, name: 'Параметр 7', type: 'text' },
      { id: 8, name: 'Параметр 8', type: 'float' },
      { id: 9, name: 'Параметр 9', type: 'bool' },
      { id: 10, name: 'Параметр 10', type: 'datetime' },
    ];
    
    // Сохраняем в localStorage
    localStorage.setItem('fallbackParameters', JSON.stringify(fallbackParameters));
    
    return fallbackParameters;
  }
}

// Параметры: создание нового параметра
export async function createParameter(
  request: CreateParameterRequest,
  existingParameters?: Parameter[]
): Promise<CreateParameterResponse> {
  const url = `${BASE_URL}/parameters/create`;
  
  try {
    // Добавляем таймаут
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000); // 5 секунд таймаут
    
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!resp.ok) {
      throw new Error(`Failed to create parameter (${resp.status})`);
    }
    
    const json = await resp.json();
    
    if (!json || typeof json !== 'object' || typeof json.id !== 'number') {
      throw new Error('Invalid response format for create parameter');
    }
    return json as CreateParameterResponse;
  } catch {
    // Fallback для тестирования - генерируем следующий ID по порядку
    console.log('Using fallback parameter creation');
    
    let fallbackId = 1;
    if (existingParameters && existingParameters.length > 0) {
      const maxId = Math.max(...existingParameters.map(p => p.id));
      fallbackId = maxId + 1;
    }
    
    // Создаем новый параметр и сохраняем в localStorage
    const newParameter: Parameter = {
      id: fallbackId,
      name: request.name,
      type: request.type
    };
    
    const updatedParameters = [...(existingParameters || []), newParameter];
    localStorage.setItem('fallbackParameters', JSON.stringify(updatedParameters));
    
    return { id: fallbackId };
  }
}

// Параметры: удаление параметра
export async function deleteParameter(id: number, existingParameters?: Parameter[]): Promise<void> {
  const url = `${BASE_URL}/executors/parameters/del`;
  
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id }),
    });
    
    if (!resp.ok) {
      throw new Error(`Failed to delete parameter (${resp.status})`);
    }
    
    // Обновляем localStorage даже при успешном удалении
    if (existingParameters) {
      const updatedParameters = existingParameters.filter(p => p.id !== id);
      localStorage.setItem('fallbackParameters', JSON.stringify(updatedParameters));
    }
  } catch {
    // Fallback для тестирования - обновляем localStorage
    console.log(`Fallback: parameter ${id} would be deleted`);
    
    if (existingParameters) {
      const updatedParameters = existingParameters.filter(p => p.id !== id);
      localStorage.setItem('fallbackParameters', JSON.stringify(updatedParameters));
    }
  }
}

// Исполнители: получение списка всех исполнителей
export async function fetchExecutors(
  options?: { signal?: AbortSignal | null }
): Promise<Executor[]> {
  const url = `${EXECUTORS_BASE_URL}/executors`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal ?? null,
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch executors (${resp.status})`);
  }
  const json = await resp.json();
  console.debug('[metrics] /executors raw:', json);
  if (!Array.isArray(json)) {
    throw new Error('Invalid response format for executors');
  }
  return json as Executor[];
}

// Исполнители: создание нового исполнителя
export async function createExecutor(
  request: CreateExecutorRequest,
  options?: { signal?: AbortSignal | null }
): Promise<CreateExecutorResponse> {
  const url = `${EXECUTORS_BASE_URL}/executors/create`;
  
  console.log('=== API DEBUG: createExecutor ===');
  console.log('URL:', url);
  console.log('Request body:', JSON.stringify(request, null, 2));
  console.log('Request headers:', {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
  console.log('================================');
  
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request),
    signal: options?.signal ?? null,
  });
  
  console.log('Response status:', resp.status);
  console.log('Response headers:', Object.fromEntries(resp.headers.entries()));
  
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error('Error response body:', errorText);
    throw new Error(`Failed to create executor (${resp.status}): ${errorText}`);
  }
  
  const json = await resp.json();
  console.debug('[metrics] /executors/create response:', json);
  if (!json || typeof json !== 'object' || typeof json.id !== 'number') {
    throw new Error('Invalid response format for create executor');
  }
  return json as CreateExecutorResponse;
}

// Метрики: получение общего количества заявок
export async function fetchTotalOrderCount(): Promise<TotalOrderCountResponse> {
  const url = `${BASE_URL}/metric/order_count`;
  
  console.log('=== FETCHING TOTAL ORDER COUNT ===');
  console.log('URL:', url);
  console.log('==================================');
  
  const resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  
  if (!resp.ok) {
    throw new Error(`Failed to fetch total order count (${resp.status})`);
  }
  
  const json = await resp.json();
  console.log('Total order count response:', json);
  
  if (!json || typeof json !== 'object' || typeof json.count !== 'number') {
    throw new Error('Invalid response format for total order count');
  }
  
  return json as TotalOrderCountResponse;
}

// Метрики: получение количества обработанных заявок
export async function fetchCompleteOrderCount(): Promise<CompleteOrderCountResponse> {
  const url = `${BASE_URL}/metric/complete_order_count`;
  
  console.log('=== FETCHING COMPLETE ORDER COUNT ===');
  console.log('URL:', url);
  console.log('=====================================');
  
  const resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  
  if (!resp.ok) {
    throw new Error(`Failed to fetch complete order count (${resp.status})`);
  }
  
  const json = await resp.json();
  console.log('Complete order count response:', json);
  
  if (!json || typeof json !== 'object' || typeof json.count !== 'number') {
    throw new Error('Invalid response format for complete order count');
  }
  
  return json as CompleteOrderCountResponse;
}

// Метрики: заявки по исполнителям
export async function fetchExecutorOrders(options?: { signal?: AbortSignal | null }): Promise<Array<{ id?: number; name?: string; requests: number }>> {
  const url = `${BASE_URL}/metric/executor_orders`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal ?? null,
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch executor orders (${resp.status})`);
  }
  const json = await resp.json();
  console.debug('[metrics] /metric/executor_orders raw:', json);

  const normalize = (arr: unknown): Array<{ id?: number; name?: string; requests: number }> => {
    if (!Array.isArray(arr)) return [];
    const out: Array<{ id?: number; name?: string; requests: number }> = [];
    for (const item of arr) {
      if (typeof item === 'number') {
        out.push({ id: out.length + 1, requests: Math.max(0, Math.floor(item)) });
      } else if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const id = typeof o['id'] === 'number' ? (o['id'] as number) : (typeof o['executor_id'] === 'number' ? (o['executor_id'] as number) : undefined);
        const name = typeof o['name'] === 'string' ? (o['name'] as string) : (typeof o['executor_name'] === 'string' ? (o['executor_name'] as string) : undefined);
        const countRaw = typeof o['orders'] === 'number' ? (o['orders'] as number) : (typeof o['count'] === 'number' ? (o['count'] as number) : Number(o['count']));
        const requests = Number.isFinite(countRaw) ? Number(countRaw) : 0;
        const result: { id?: number; name?: string; requests: number } = { requests: Math.max(0, Math.floor(requests)) };
        if (typeof id === 'number') result.id = id;
        if (typeof name === 'string' && name.length > 0) result.name = name;
        out.push(result);
      }
    }
    return out;
  };

  return normalize(json);
}


