// Виджет метрик: слева KPI в %, справа мини-график заявок по исполнителям
import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MetricsBlockProps {
  className?: string;
  kpiPercent?: number;
}

const Container = styled.div`
  width: calc(100% - 64px);
  margin: 0 32px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  box-sizing: border-box;
`;

const Panel = styled.div`
  width: 100%;
  height: 420px;
  border-radius: 10px;
  border: 2px #C8C8C8 solid;
  background-color: #FFFFFF;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 16px;
`;

const LeftPanel = styled(Panel)`
  border: none;
  padding-top: 0;
  padding-bottom: 0;
`;

//

const LeftStack = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px; /* промежуток между блоками */
`;

const LeftBlockPrimary = styled.div`
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  border-radius: 10px;
  border: 2px #FF5A00 solid;
`;

const LeftBlockSecondary = styled.div`
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  border-radius: 10px;
  border: 2px #C8C8C8 solid;
`;

// Legend and tooltip styled elements (defined outside component to avoid re-creation on each render)
const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9E9E9E;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LineSwatch = styled.span`
  display: inline-block;
  width: 24px;
  height: 0;
  border-top: 3px solid #FF5A00;
  border-radius: 2px;
`;

const AxisSwatch = styled.span`
  display: inline-block;
  width: 24px;
  height: 0;
  border-top: 2px dashed #C8C8C8;
`;

const LegendNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;
const LegendNoteLabel = styled.span`
  color: #9E9E9E;
`;
const LegendNoteValue = styled.span`
  color: #00B4DD;
  font-weight: 500;
`;

const TooltipContainer = styled.div`
  background: #ffffff;
  border: 1px solid #E0E0E0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 12px 14px;
  color: #333333;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.3;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
`;

const TooltipLabel = styled.span`
  color: #9E9E9E;
`;

const TooltipValue = styled.span`
  color: #00B4DD;
  font-weight: 500;
`;

const ChartArea = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;
`;

const LegendWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// common style for numbers in left blocks
const SKdT = styled.span`
  color: black;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
`;

export const MetricsBlock: React.FC<MetricsBlockProps> = ({ className }) => {
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{ payload?: { performers?: string; requests?: number } }>;
  }

  

  //
  const chartData = useMemo(() => {
    // Ровная линия с общим количеством 4000 заявок на 60 исполнителей и наглядным взлетом в конце
    const numPerformers = 80;
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

  const averagePerformerRequests = useMemo(() => {
    if (chartData.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < chartData.length; i += 1) {
      sum += chartData[i]!.requests;
    }
    return sum / chartData.length;
  }, [chartData]);

  const renderLegend = useCallback(() => {
    const lastPoint = chartData[chartData.length - 1];
    const deviationPct = averagePerformerRequests > 0 && lastPoint ? ((lastPoint.requests - averagePerformerRequests) / averagePerformerRequests) * 100 : 0;
    const deviationText = `${deviationPct >= 0 ? '+' : ''}${Math.round(deviationPct)}%`;

    return (
      <LegendContainer>
        <LegendRow>
          <LegendItem>
            <LineSwatch />
            <span>заявки</span>
          </LegendItem>
          <LegendItem>
            <AxisSwatch />
            <span>исполнители</span>
          </LegendItem>
        </LegendRow>
        <LegendNote>
          <LegendNoteLabel>отклонение (последний):</LegendNoteLabel>
          <LegendNoteValue>{deviationText}</LegendNoteValue>
        </LegendNote>
      </LegendContainer>
    );
  }, [chartData, averagePerformerRequests]);

  const renderTooltip = useCallback((props: TooltipProps) => {
    const { active, payload } = props;
    if (!active || !payload || payload.length === 0) return null;
    const point = payload[0]?.payload;
    if (!point) return null;
    const avg = averagePerformerRequests;
    const deviationPct = avg > 0 ? ((point.requests ?? 0) - avg) / avg * 100 : 0;
    const hasDeviation = Number.isFinite(deviationPct) && Math.abs(deviationPct) >= 0.5;
    const deviationText = `${deviationPct >= 0 ? '+' : ''}${Math.round(deviationPct)}%`;
    return (
      <TooltipContainer>
        <TooltipRow>
          <TooltipLabel>исполнитель:</TooltipLabel>
          <TooltipValue>{point.performers}</TooltipValue>
        </TooltipRow>
        <TooltipRow>
          <TooltipLabel>заявок:</TooltipLabel>
          <TooltipValue>{typeof point.requests === 'number' ? point.requests.toLocaleString() : String(point.requests)}</TooltipValue>
        </TooltipRow>
        {hasDeviation && (
          <TooltipRow>
            <TooltipLabel>отклонение:</TooltipLabel>
            <TooltipValue>{deviationText}</TooltipValue>
          </TooltipRow>
        )}
      </TooltipContainer>
    );
  }, [averagePerformerRequests]);

  return (
    <Container className={className}>
      <LeftPanel>
        <LeftStack>
          <LeftBlockPrimary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', padding: '0 16px 0 24px', height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <SKdT style={{ width: '100%', fontSize: 48, lineHeight: 1, wordWrap: 'break-word', textAlign: 'left' }}>132 896</SKdT>
              <div style={{ width: '100%', color: 'black', fontSize: 20, lineHeight: 1, fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: '400', wordWrap: 'break-word', textAlign: 'left' }}>заявок за все время</div>
            </div>
          </LeftBlockPrimary>
          <LeftBlockSecondary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', padding: '0 16px 0 24px', height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <SKdT style={{ width: '100%', fontSize: 48, lineHeight: 1, wordWrap: 'break-word', textAlign: 'left' }}>131 969</SKdT>
              <div style={{ width: '100%', color: 'black', fontSize: 20, lineHeight: 1, fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: '400', wordWrap: 'break-word', textAlign: 'left' }}>обработанных заявок за все время</div>
            </div>
          </LeftBlockSecondary>
        </LeftStack>
      </LeftPanel>
      <Panel>
        <ChartArea>
          <ResponsiveContainer width="100%" height="100%" minHeight={0}>
            <LineChart data={chartData} margin={{ top: 24, right: 24, left: 24, bottom: 8 }}>
            <CartesianGrid stroke="none" />
            <XAxis
              dataKey="performers"
              tick={{ fill: '#C8C8C8', fontSize: 16, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
                dy={6}
              axisLine={{ stroke: '#C8C8C8', strokeWidth: 2, strokeDasharray: '4 4' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              domain={[0, maxY]}
              tick={{ fill: '#C8C8C8', fontSize: 16, fontFamily: 'Golos Text, sans-serif', fontWeight: 400 }}
              tickCount={5}
              allowDecimals={false}
              axisLine={{ stroke: '#C8C8C8' }}
              tickLine={false}
              tickFormatter={(v: number) => (typeof v === 'number' ? v.toLocaleString() : String(v))}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={renderTooltip}
              isAnimationActive={false}
              offset={12}
              allowEscapeViewBox={{ x: false, y: true }}
              wrapperStyle={{ pointerEvents: 'none' }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#FF5A00"
              strokeWidth={dataLength > 1000 ? 2 : 3}
              dot={dataLength > 200 ? false : { r: 3, stroke: '#FF5A00', fill: '#FF5A00' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            </LineChart>
          </ResponsiveContainer>
        </ChartArea>
        <LegendWrapper>
          {renderLegend()}
        </LegendWrapper>
      </Panel>
    </Container>
  );
};


