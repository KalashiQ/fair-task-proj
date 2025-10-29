// Виджет столбчатого графика заявок с табами периодов
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Label } from 'recharts';
import { PeriodTabs } from '@/shared/ui';
import { fetchOrderCount, type OrderCountResponse } from '@/shared/api/metrics';

interface DataPoint {
  timeRange: string;
  value: number;
  originalTimestamp?: string; // Добавляем оригинальный timestamp
}

interface ChartWidgetProps {
  className?: string;
  onPeriodChange?: (period: 'hour' | 'day' | 'week') => void;
}

const XAxisUnitsLabel: React.FC<{ viewBox?: { x: number; y: number; width: number; height: number }; value?: string }> = (props) => {
  const { viewBox, value } = props ?? {};
  if (!viewBox) return null;
  const { x = 0, y = 0, width = 0, height = 0 } = viewBox;
  const labelX = x + width;
  const labelY = y + height + 25; // Увеличиваем отступ снизу
  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="end"
      fill="#FF9500"
      fontSize={20}
      fontFamily="Golos Text, sans-serif"
    >
      {value}
    </text>
  );
};

const ChartContainer = styled.div`
  width: calc(100% - 64px);
  margin: 0 32px;
  padding: 0 20px 40px 20px;
  background-color: #ffffff;
  box-sizing: border-box;
`;



// Функция для преобразования данных API в формат для графика
const transformApiDataToChartData = (apiData: OrderCountResponse, period: 'hour' | 'day' | 'week'): DataPoint[] => {
  if (apiData.length === 0) {
    return [];
  }
  
  // Сортируем по времени (ts)
  const sortedData = [...apiData].sort((a, b) => a.ts.localeCompare(b.ts));
  
  // Названия дней недели
  const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  
  return sortedData.map((item, index) => {
    // Форматируем время в понятном виде для отображения на оси X
    let displayTime = item.ts;
    
    // Если это ISO дата, форматируем её
    if (item.ts.includes('T') && item.ts.includes(':')) {
      try {
        const date = new Date(item.ts);
        if (!isNaN(date.getTime())) {
          if (period === 'hour') {
            // Для часового периода показываем только минуты
            const minutes = date.getMinutes();
            displayTime = String(minutes);
          } else if (period === 'week') {
            // Для недельного периода показываем названия дней циклически
            displayTime = dayNames[index % 7] ?? `День ${index + 1}`;
          } else {
            // Для дневного периода показываем часы
            const hours = date.getHours();
            displayTime = String(hours);
          }
        }
      } catch {
        // Если не удалось распарсить, оставляем как есть
        displayTime = item.ts;
      }
    }
    
    return {
      timeRange: displayTime,
      value: item.count,
      originalTimestamp: item.ts // Сохраняем оригинальный timestamp
    };
  });
};

export const ChartWidget: React.FC<ChartWidgetProps> = ({ className, onPeriodChange }) => {
  const [period, setPeriod] = useState<'hour' | 'day' | 'week'>('hour');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных с API при изменении периода
  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    
    async function loadChartData() {
      console.log('=== CHART WIDGET LOADING DATA ===');
      console.log('Loading data for period:', period);
      console.log('==================================');
      
      setLoading(true);
      setError(null);
      
      try {
        const apiData = await fetchOrderCount(period, { signal: controller.signal });
        console.log('API data received:', apiData);
        
        if (aborted) return;
        
        const transformedData = transformApiDataToChartData(apiData, period);
        console.log('Transformed data:', transformedData);
        
        setChartData(transformedData);
      } catch (err) {
        if (aborted) return;
        console.error('Failed to load chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setChartData([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    
    loadChartData();
    
    return () => {
      aborted = true;
      controller.abort();
    };
  }, [period]);

  const chartConfig = useMemo(() => {
    if (chartData.length === 0) {
      return {
        data: [],
        maxValue: 100,
        dataMax: 0,
      };
    }
    
    const dataMax = Math.max(...chartData.map(d => d.value));
    
    return {
      data: chartData,
      maxValue: Math.ceil(dataMax * 1.1),
      dataMax,
    };
  }, [chartData]);

  const handlePeriodChange = useCallback((newPeriod: 'hour' | 'day' | 'week') => {
    console.log('=== CHART WIDGET PERIOD CHANGE ===');
    console.log('Button clicked for period:', newPeriod);
    console.log('Previous period was:', period);
    console.log('Calling onPeriodChange callback...');
    console.log('==================================');
    
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  }, [onPeriodChange, period]);

  const getBarColor = useCallback((index: number) => (hoveredIndex === index ? '#FF9500' : '#E0E0E0'), [hoveredIndex]);

  const handleMouseEnterBar = useCallback((_entry: unknown, index: number) => {
    setHoveredIndex((prev) => (prev === index ? prev : index));
  }, []);

  const handleMouseLeaveBar = useCallback(() => {
    setHoveredIndex((prev) => (prev === null ? prev : null));
  }, []);

  interface TooltipPayloadItem {
    payload?: { 
      timeRange?: string;
      originalTimestamp?: string;
    };
    value?: number;
  }

  const renderTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (active && payload && payload[0]) {
      const timeRange = payload[0].payload?.timeRange as string | undefined;
      const originalTimestamp = payload[0].payload?.originalTimestamp as string | undefined;
      const value = payload[0].value as number | undefined;
      
      // Форматируем время в понятном виде для пользователя
      let timeLabel = '';
      if (timeRange) {
        if (period === 'hour') {
          // Для часового периода показываем минуты
          const minute = Number.parseInt(timeRange, 10);
          if (!Number.isNaN(minute)) {
            timeLabel = `Минута ${minute + 1}`;
          } else {
            timeLabel = timeRange;
          }
        } else if (period === 'day') {
          // Для дневного периода показываем часы
          if (timeRange.includes('-')) {
            timeLabel = `Время: ${timeRange}`;
          } else {
            timeLabel = `Час: ${timeRange}`;
          }
        } else if (period === 'week') {
          // Для недельного периода показываем дни
          timeLabel = `День: ${timeRange}`;
        }
      }
      
      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #C8C8C8',
          borderRadius: '8px',
          padding: '12px 16px',
          fontFamily: 'Golos Text, sans-serif',
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          minWidth: '200px'
        }}>
          {timeLabel && (
            <div style={{ 
              color: '#333333', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              {timeLabel}
            </div>
          )}
          {originalTimestamp && (
            <div style={{ 
              color: '#666666', 
              marginBottom: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {originalTimestamp}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#00B4DD',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {value?.toLocaleString() || '0'}
            </span>
            <span style={{ 
              color: '#666666', 
              marginLeft: '8px',
              fontSize: '14px'
            }}>
              заявок
            </span>
          </div>
        </div>
      );
    }
    return null;
  }, [period]);

  return (
    <ChartContainer className={className}>
      <PeriodTabs activePeriod={period} onPeriodChange={handlePeriodChange} />
      
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: '18px',
          color: '#666666'
        }}>
          Загрузка данных...
        </div>
      )}
      
      {error && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: '18px',
          color: '#ff4444',
          textAlign: 'center',
          padding: '20px'
        }}>
          Ошибка загрузки: {error}
        </div>
      )}
      
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartConfig.data}
            margin={{ top: 56, right: 30, left: 20, bottom: 120 }}
            barSize={period === 'hour' ? 8 : 40}
            barGap={period === 'hour' ? 1 : 4}
          >
            <CartesianGrid stroke="none" />
            <XAxis
              dataKey="timeRange"
              tick={{ fill: '#C8C8C8', fontSize: 20, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
              angle={0}
              dy={20}
              axisLine={false}
              tickLine={false}
              interval={period === 'hour' ? 4 : 0}
              tickFormatter={(value) => {
                if (period === 'hour') {
                  const num = Number.parseInt(value, 10);
                  return isNaN(num) ? value : String(num + 1);
                }
                return value;
              }}
            >
              <Label
                content={<XAxisUnitsLabel value={period === 'hour' ? 'минуты' : period === 'day' ? 'часы' : 'дни'} />}
              />
            </XAxis>
            <YAxis
              domain={[0, chartConfig.maxValue]}
              tick={{ fill: '#C8C8C8', fontSize: 20, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
              tickCount={6}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value="заявки"
                position="top"
                offset={38}
                angle={0}
                fill="#FF9500"
                fontSize={20}
                fontFamily="Golos Text, sans-serif"
              />
            </YAxis>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={renderTooltip}
              isAnimationActive={false}
              offset={12}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ pointerEvents: 'none' }}
            />
            <Bar 
              dataKey="value"
              isAnimationActive={false}
              onMouseEnter={handleMouseEnterBar}
              onMouseLeave={handleMouseLeaveBar}
            >
              {chartConfig.data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};
