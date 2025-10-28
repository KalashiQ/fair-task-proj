import React from 'react';
import styled from 'styled-components';

/**
 * Интерфейс для пропсов PeriodTabs компонента
 */
interface PeriodTabsProps {
  activePeriod: 'hour' | 'day' | 'week';
  onPeriodChange: (period: 'hour' | 'day' | 'week') => void;
  className?: string;
}

/**
 * Контейнер для табов
 */
const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 40px;
  padding: 20px 0 20px 0;
  position: relative;
`;

/**
 * Таб периода
 */
const PeriodTab = styled.button<{ $isActive: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isActive ? '#00B4DD' : '#C8C8C8'};
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  cursor: pointer;
  padding: 0;
  position: relative;
  padding-bottom: 5px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #00B4DD;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.$isActive ? '#00B4DD' : 'transparent'};
    transition: background-color 0.2s ease;
  }
`;

/**
 * Компонент переключателя периода
 */
export const PeriodTabs: React.FC<PeriodTabsProps> = ({ activePeriod, onPeriodChange, className }) => {
  const periods = [
    { value: 'hour' as const, label: 'Час' },
    { value: 'day' as const, label: 'День' },
    { value: 'week' as const, label: 'Неделя' },
  ];

  return (
    <TabsContainer className={className}>
      {periods.map((period) => (
        <PeriodTab
          key={period.value}
          $isActive={activePeriod === period.value}
          onClick={() => onPeriodChange(period.value)}
          type="button"
        >
          {period.label}
        </PeriodTab>
      ))}
    </TabsContainer>
  );
};
