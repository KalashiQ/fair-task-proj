// Страница Dashboard: шапка, заголовок, общая статистика, график и метрики
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Header, PageHeader, StatsBlock } from '@/shared/ui';
import { ChartWidget, MetricsBlock } from '@/widgets';
import { fetchOrderCount, sumOrderCount } from '@/shared';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 124px 0 0 0; /* компенсируем фиксированный Header (124px) */
  box-sizing: border-box;
`;

const DashboardContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  will-change: transform;
`;

export const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'week'>('hour');
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLabelByPeriod = (period: 'hour' | 'day' | 'week'): string => {
    switch (period) {
      case 'hour':
        return 'за последний час';
      case 'day':
        return 'за последний день';
      case 'week':
        return 'за последнюю неделю';
      default:
        return 'за последний час';
    }
  };

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    async function load() {
      console.log('=== DASHBOARD PERIOD CHANGE ===');
      console.log('Period changed to:', selectedPeriod);
      console.log('Triggering fetchOrderCount...');
      console.log('================================');
      
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOrderCount(selectedPeriod, { signal: controller.signal });
        console.debug('[Dashboard] fetched order_count:', data);
        if (aborted) return;
        const sum = sumOrderCount(data);
        console.debug('[Dashboard] summed value:', sum);
        setTotalOrders(sum);
      } catch (e) {
        if (aborted) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
        setTotalOrders(null);
      } finally {
        if (!aborted) setIsLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, [selectedPeriod]);

  const formattedValue = useMemo(() => {
    if (isLoading) return '...';
    if (error) return '—';
    if (typeof totalOrders === 'number') return totalOrders.toLocaleString();
    return '0';
  }, [isLoading, error, totalOrders]);

  return (
    <DashboardContainer>
      <Header />
      <PageHeader title="Dashboard" />
      <StatsBlock value={formattedValue} label={getLabelByPeriod(selectedPeriod)} />
      <ChartWidget onPeriodChange={setSelectedPeriod} />
      <DashboardContent>
        <MetricsBlock/>
      </DashboardContent>
    </DashboardContainer>
  );
};
