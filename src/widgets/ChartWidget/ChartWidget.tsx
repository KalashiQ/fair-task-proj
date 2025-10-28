// Виджет столбчатого графика заявок с табами периодов
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Label } from 'recharts';
import { PeriodTabs } from '@/shared/ui';

interface DataPoint {
  timeRange: string;
  value: number;
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
  const labelY = y + height + 9;
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



const generateMinuteData = (): DataPoint[] => {
  const intervals = [
    { range: '0-15', targetValue: 5200 },
    { range: '15-30', targetValue: 6800 },
    { range: '30-45', targetValue: 3100 },
    { range: '45-60', targetValue: 6200 },
  ];
  
  const minuteData: DataPoint[] = [];
  
  intervals.forEach((interval) => {
    const parts = interval.range.split('-');
    const start = Number.parseInt(parts[0] || '0', 10);
    const end = Number.parseInt(parts[1] || '0', 10);
    const intervalSize = end - start;
    const avgValue = interval.targetValue / intervalSize;
    
    for (let minute = start; minute < end; minute++) {
      const variation = (Math.random() - 0.5) * 0.4;
      const minuteValue = avgValue * (1 + variation);
      
      minuteData.push({
        timeRange: `${minute}`,
        value: Math.max(0, Math.round(minuteValue)),
      });
    }
  });
  
  return minuteData;
};

const mockData = {
  hour: generateMinuteData(),
  day: [
    { timeRange: '0-4', value: 1200 },
    { timeRange: '4-8', value: 5800 },
    { timeRange: '8-12', value: 6500 },
    { timeRange: '12-16', value: 7200 },
    { timeRange: '16-20', value: 4900 },
    { timeRange: '20-24', value: 3100 },
  ],
  week: [
    { timeRange: 'ПН', value: 6800 },
    { timeRange: 'ВТ', value: 7200 },
    { timeRange: 'СР', value: 5900 },
    { timeRange: 'ЧТ', value: 6400 },
    { timeRange: 'ПТ', value: 5500 },
    { timeRange: 'СБ', value: 2800 },
    { timeRange: 'ВС', value: 2100 },
  ],
};

export const ChartWidget: React.FC<ChartWidgetProps> = ({ className, onPeriodChange }) => {
  const [period, setPeriod] = useState<'hour' | 'day' | 'week'>('hour');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const data = mockData[period];
    const dataMax = Math.max(...data.map(d => d.value));
    
    return {
      data,
      maxValue: Math.ceil(dataMax * 1.1),
      dataMax,
    };
  }, [period]);

  const handlePeriodChange = (newPeriod: 'hour' | 'day' | 'week') => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getBarColor = (index: number) => (hoveredIndex === index ? '#FF9500' : '#E0E0E0');

  return (
    <ChartContainer className={className}>
      <PeriodTabs activePeriod={period} onPeriodChange={handlePeriodChange} />
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData.data}
          margin={{ top: 56, right: 30, left: 20, bottom: 104 }}
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
            domain={[0, chartData.maxValue]}
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
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const originalValue = payload[0].payload?.timeRange as string | undefined;
                let minuteLabel: string | null = null;
                if (period === 'hour' && originalValue != null) {
                  const parsed = Number.parseInt(originalValue, 10);
                  const displayedMinute = Number.isNaN(parsed) ? originalValue : String(parsed + 1);
                  minuteLabel = `минута ${displayedMinute}`;
                }
                return (
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #C8C8C8',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'Golos Text, sans-serif',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    {minuteLabel && (
                      <div style={{ color: '#666666', marginBottom: '6px' }}>
                        {minuteLabel}
                      </div>
                    )}
                    <span style={{ color: '#00B4DD' }}>
                      {payload[0].value?.toLocaleString()}
                    </span>
                    <span style={{ color: '#666666', marginLeft: '8px' }}>
                      заявок
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value"
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {chartData.data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
