// Блок статистики: крупное значение и подпись
import React from 'react';
import styled from 'styled-components';

interface StatsBlockProps {
  value: string;
  label: string;
  className?: string;
}

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 64px); /* Вычитаем боковые отступы */
  padding: 40px 20px;
  margin: 0 32px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

/**
 * Значение статистики
 */
const StatsValue = styled.div`
  color: black;
  font-size: 48px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  text-align: center;
  line-height: 1;
  margin: 0;
  padding: 0;
`;

/**
 * Подпись статистики
 */
const StatsLabel = styled.div`
  color: #C8C8C8;
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  text-align: center;
  line-height: 1;
  margin: 0;
  padding: 0;
  margin-top: 6px;
`;

/**
 * StatsBlock компонент
 * Отображает значение статистики и подпись
 */
export const StatsBlock: React.FC<StatsBlockProps> = ({ value, label, className }) => {
  return (
    <StatsContainer className={className}>
      <StatsValue>{value}</StatsValue>
      <StatsLabel>{label}</StatsLabel>
    </StatsContainer>
  );
};
