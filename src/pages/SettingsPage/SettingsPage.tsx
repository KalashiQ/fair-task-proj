import React from 'react';
import styled from 'styled-components';
import { Header, PageHeader } from '@/shared/ui';

const SettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const SettingsContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const PlaceholderText = styled.div`
  color: #999999;
  font-size: 24px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
`;

/**
 * Страница настроек
 * Заглушечная страница для настроек приложения
 */
export const SettingsPage: React.FC = () => {
  return (
    <SettingsContainer>
      <Header />
      <PageHeader title="Настройки" />
      <SettingsContent>
        <PlaceholderText>Настройки скоро будут доступны</PlaceholderText>
      </SettingsContent>
    </SettingsContainer>
  );
};
