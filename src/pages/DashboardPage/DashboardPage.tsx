// Страница Dashboard: шапка, заголовок, общая статистика, график и метрики
import React, { useState } from 'react';
import styled from 'styled-components';
import { Header, PageHeader, StatsBlock } from '@/shared/ui';
import { ChartWidget, MetricsBlock } from '@/widgets';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
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

  return (
    <DashboardContainer>
      <Header />
      <PageHeader title="Dashboard" />
      <StatsBlock value="8952" label={getLabelByPeriod(selectedPeriod)} />
      <ChartWidget onPeriodChange={setSelectedPeriod} />
      <DashboardContent>
        <MetricsBlock kpiPercent={78} />
      </DashboardContent>
    </DashboardContainer>
  );
};
