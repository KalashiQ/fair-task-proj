import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%; /* Занимаем всю доступную высоту */
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const DashboardTitle = styled.h1`
  color: #1F1F1F;
  font-size: 32px;
  font-weight: 600;
  font-family: 'Inter';
  margin: 0;
`;

/**
 * Страница Dashboard
 * Отображает главную панель управления приложения
 */
export const DashboardPage: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardTitle>Dashboard</DashboardTitle>
    </DashboardContainer>
  );
};
