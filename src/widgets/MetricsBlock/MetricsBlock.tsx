// Виджет метрик: слева KPI в %, справа мини-график заявок по исполнителям
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';

interface MetricsBlockProps {
  className?: string;
  kpiPercent?: number;
}

const Container = styled.div`
  width: calc(100% - 64px);
  margin: 0 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  box-sizing: border-box;
`;

const Panel = styled.div`
  width: 100%;
  height: 341px;
  border-radius: 10px;
  border: 2px #C8C8C8 solid;
  background-color: #FFFFFF;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const KpiValue = styled.div`
  color: black;
  font-size: 72px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  line-height: 1;
  text-align: center;
`;

const KpiSuffix = styled.span`
  color: #C8C8C8;
  font-size: 24px;
  margin-left: 8px;
`;

export const MetricsBlock: React.FC<MetricsBlockProps> = ({ className, kpiPercent = 78 }) => {
  const chartData = useMemo(() => {
    // Ровная линия с общим количеством 4000 заявок на 60 исполнителей и наглядным взлетом в конце
    const numPerformers = 60;
    const totalRequests = 4000;

    const base = Math.floor(totalRequests / numPerformers);
    let remainder = totalRequests - base * numPerformers;

    const data = Array.from({ length: numPerformers }, (_, idx) => ({
      performers: String(idx + 1),
      requests: base,
    }));
    for (let idx = 0; idx < numPerformers && remainder > 0; idx += 1) {
      const point = data[idx];
      if (point) point.requests += 1;
      remainder -= 1;
    }

    // Сохраняем исходные значения для последних двух
    const preLastIndex = numPerformers - 2;
    const lastIndex = numPerformers - 1;
    const preLastOriginal = data[preLastIndex]?.requests ?? 0;
    const lastOriginal = data[lastIndex]?.requests ?? 0;

    // Применяем рост: +20% предпоследний, +70% последний
    const preLastBoosted = Math.max(0, Math.round(preLastOriginal * 1.2));
    const lastBoosted = Math.max(0, Math.round(lastOriginal * 1.7));

    const prePoint = data[preLastIndex];
    if (prePoint) {
      prePoint.requests = preLastBoosted;
    }
    if (data[lastIndex]) data[lastIndex].requests = lastBoosted;

    // Компенсируем общий прирост одним проходом без длинных циклов
    let delta = (preLastBoosted - preLastOriginal) + (lastBoosted - lastOriginal);
    if (delta > 0) {
      const donors: number[] = [];
      for (let idx = 0; idx < numPerformers; idx += 1) {
        if (idx !== preLastIndex && idx !== lastIndex) donors.push(idx);
      }
      const donorsCount = donors.length;
      const baseCut = Math.floor(delta / donorsCount);
      let cutRemainder = delta % donorsCount;
      for (const idx of donors) {
        const point = data[idx];
        if (!point) continue;
        const cut = baseCut + (cutRemainder > 0 ? 1 : 0);
        if (cutRemainder > 0) cutRemainder -= 1;
        const applied = Math.min(point.requests, cut);
        point.requests -= applied;
        delta -= applied;
      }
    }

    // На всякий случай корректируем сумму на +-1 из-за округлений
    const currentSum = data.reduce((acc, d) => acc + d.requests, 0);
    let diff = currentSum - totalRequests;
    if (diff !== 0) {
      if (diff > 0) {
        // урезаем из начала
        for (let idx = 0; idx < numPerformers && diff > 0; idx += 1) {
          if ((data[idx]?.requests ?? 0) > 0) {
            data[idx]!.requests -= 1;
            diff -= 1;
          }
        }
      } else {
        // добавляем к началу
        for (let idx = 0; idx < numPerformers && diff < 0; idx += 1) {
          data[idx]!.requests += 1;
          diff += 1;
        }
      }
    }

    return data;
  }, []);

  const dataLength = chartData.length;

    const maxY = useMemo(() => {
      let m = 0;
      for (let i = 0; i < chartData.length; i += 1) {
        const point = chartData[i];
        if (!point) continue;
        const v = point.requests;
        if (v > m) m = v;
      }
      return Math.ceil(m * 1.1);
    }, [chartData]);

  return (
    <Container className={className}>
      <Panel>
        <KpiValue>
          {kpiPercent}
          <KpiSuffix>% KPI</KpiSuffix>
        </KpiValue>
      </Panel>
      <Panel>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 32, right: 24, left: 24, bottom: 48 }}>
            <CartesianGrid stroke="none" />
            <XAxis
              dataKey="performers"
              tick={{ fill: '#C8C8C8', fontSize: 16, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
              dy={12}
              axisLine={{ stroke: '#C8C8C8' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            >
              <Label value="исполнители" position="insideBottomRight" offset={8} fill="#C8C8C8" fontSize={16} fontFamily="Golos Text, sans-serif" />
            </XAxis>
            <YAxis
              domain={[0, maxY]}
              tick={{ fill: '#C8C8C8', fontSize: 16, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
              tickCount={5}
              allowDecimals={false}
              axisLine={{ stroke: '#C8C8C8' }}
              tickLine={false}
              tickFormatter={(v: number) => (typeof v === 'number' ? v.toLocaleString() : String(v))}
              width={60}
            >
              <Label value="заявки" position="top" offset={8} fill="#C8C8C8" fontSize={16} fontFamily="Golos Text, sans-serif" />
            </YAxis>
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#FF9500"
              strokeWidth={dataLength > 1000 ? 2 : 3}
              dot={dataLength > 200 ? false : { r: 3, stroke: '#FF9500', fill: '#FF9500' }}
              activeDot={{ r: 5 }}
              isAnimationActive={dataLength <= 1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    </Container>
  );
};


