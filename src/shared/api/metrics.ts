// Метрики: API для получения количества заявок
export type MetricsPeriod = 'hour' | 'day' | 'week';

export interface Executor {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  order_count: number;
  parameters: Array<{
    id: number;
    operation: '>' | '<' | '=' | '<x<';
    value: string;
  }> | null;
}

export interface OrderCountResponse {
  [isoDateTime: string]: number;
}

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

// Для dev окружения используем прокси /api в Vite, чтобы обойти CORS
const BASE_URL = '/api';
const EXECUTORS_BASE_URL = '/executors-api';

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


