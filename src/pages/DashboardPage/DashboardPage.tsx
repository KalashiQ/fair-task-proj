import React from 'react';
import styled from 'styled-components';
import { Header, PageHeader } from '@/shared/ui';

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
      <Header />
      <PageHeader title="Dashboard" />
      <DashboardContent>
        <DashboardTitle>Dashboard</DashboardTitle>
      </DashboardContent>
    </DashboardContainer>
  );
};
