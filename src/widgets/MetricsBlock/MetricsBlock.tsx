// Виджет метрик: слева KPI в %, справа мини-график заявок по исполнителям
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { fetchExecutors, fetchTotalOrderCount, fetchCompleteOrderCount } from '@/shared';

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

const MedianSwatch = styled.span`
  display: inline-block;
  width: 24px;
  height: 0;
  border-top: 2px dashed #00B4DD;
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

  const [chartData, setChartData] = useState<Array<{ performers: string; requests: number }>>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [completeOrders, setCompleteOrders] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    
    async function load() {
      console.log('=== METRICS BLOCK LOADING ===');
      setLoading(true);
      setError(null);
      
      try {
        // Загружаем все данные параллельно
        const [executors, totalOrdersData, completeOrdersData] = await Promise.all([
          fetchExecutors({ signal: controller.signal }),
          fetchTotalOrderCount(),
          fetchCompleteOrderCount()
        ]);
        
        if (aborted) return;
        
        console.log('All data loaded:', { executors, totalOrdersData, completeOrdersData });
        
        // Обрабатываем данные исполнителей
        const data = executors.map((executor, idx) => ({ 
          performers: String(idx + 1), 
          requests: Math.max(0, Math.floor(Number(executor.order_count))) 
        }));
        
        setChartData(data);
        setTotalOrders(totalOrdersData.count);
        setCompleteOrders(completeOrdersData.count);
        
        console.log('Metrics block data set:', { 
          chartDataLength: data.length, 
          totalOrders: totalOrdersData.count, 
          completeOrders: completeOrdersData.count 
        });
        
      } catch (err) {
        if (aborted) return;
        console.error('Failed to load metrics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
        setChartData([]);
        setTotalOrders(null);
        setCompleteOrders(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    
    // Загружаем данные сразу
    load();
    
    // Устанавливаем интервал для обновления каждую минуту
    const interval = setInterval(() => {
      if (!aborted) {
        load();
      }
    }, 60000); // 60 секунд
    
    return () => {
      aborted = true;
      controller.abort();
      clearInterval(interval);
    };
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

  const medianPerformerRequests = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sortedRequests = chartData.map(d => d.requests).sort((a, b) => a - b);
    const mid = Math.floor(sortedRequests.length / 2);
    if (sortedRequests.length % 2 === 0) {
      const mid1 = sortedRequests[mid - 1];
      const mid2 = sortedRequests[mid];
      if (mid1 !== undefined && mid2 !== undefined) {
        return (mid1 + mid2) / 2;
      }
      return 0;
    }
    const medianValue = sortedRequests[mid];
    return medianValue !== undefined ? medianValue : 0;
  }, [chartData]);

  const renderLegend = useCallback(() => {
    const lastPoint = chartData[chartData.length - 1];
    const deviationPct = medianPerformerRequests > 0 && lastPoint ? ((lastPoint.requests - medianPerformerRequests) / medianPerformerRequests) * 100 : 0;
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
          <LegendItem>
            <MedianSwatch />
            <span>медиана</span>
          </LegendItem>
        </LegendRow>
        <LegendNote>
          <LegendNoteLabel>медиана:</LegendNoteLabel>
          <LegendNoteValue>{Math.round(medianPerformerRequests).toLocaleString()}</LegendNoteValue>
        </LegendNote>
        <LegendNote>
          <LegendNoteLabel>отклонение от медианы (последний):</LegendNoteLabel>
          <LegendNoteValue>{deviationText}</LegendNoteValue>
        </LegendNote>
      </LegendContainer>
    );
  }, [chartData, medianPerformerRequests]);

  const renderTooltip = useCallback((props: TooltipProps) => {
    const { active, payload } = props;
    if (!active || !payload || payload.length === 0) return null;
    const point = payload[0]?.payload;
    if (!point) return null;
    const median = medianPerformerRequests;
    const deviationPct = median > 0 ? ((point.requests ?? 0) - median) / median * 100 : 0;
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
        <TooltipRow>
          <TooltipLabel>медиана:</TooltipLabel>
          <TooltipValue>{Math.round(median).toLocaleString()}</TooltipValue>
        </TooltipRow>
        {hasDeviation && (
          <TooltipRow>
            <TooltipLabel>отклонение от медианы:</TooltipLabel>
            <TooltipValue>{deviationText}</TooltipValue>
          </TooltipRow>
        )}
      </TooltipContainer>
    );
  }, [medianPerformerRequests]);

  return (
    <Container className={className}>
      <LeftPanel>
        <LeftStack>
          <LeftBlockPrimary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', padding: '0 16px 0 24px', height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <SKdT style={{ width: '100%', fontSize: 48, lineHeight: 1, wordWrap: 'break-word', textAlign: 'left' }}>
                {loading ? '...' : error ? '—' : totalOrders?.toLocaleString() || '0'}
              </SKdT>
              <div style={{ width: '100%', color: 'black', fontSize: 20, lineHeight: 1, fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: '400', wordWrap: 'break-word', textAlign: 'left' }}>заявок за все время</div>
            </div>
          </LeftBlockPrimary>
          <LeftBlockSecondary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', padding: '0 16px 0 24px', height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <SKdT style={{ width: '100%', fontSize: 48, lineHeight: 1, wordWrap: 'break-word', textAlign: 'left' }}>
                {loading ? '...' : error ? '—' : completeOrders?.toLocaleString() || '0'}
              </SKdT>
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
            <ReferenceLine
              y={medianPerformerRequests}
              stroke="#00B4DD"
              strokeWidth={2}
              strokeDasharray="5 5"
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


