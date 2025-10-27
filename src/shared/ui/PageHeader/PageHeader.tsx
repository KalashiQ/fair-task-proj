import React from 'react';
import styled from 'styled-components';

/**
 * Интерфейс для пропсов PageHeader компонента
 */
interface PageHeaderProps {
  title: string;
  className?: string;
}

/**
 * Контейнер для PageHeader
 */
const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 64px); /* Вычитаем боковые отступы */
  height: 80px;
  padding: 0 20px;
  margin: 0 32px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

/**
 * Название страницы
 */
const PageTitle = styled.h1`
  color: black;
  font-size: 36px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  margin: 0;
`;

/**
 * Кнопка экспорта Excel
 */
const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 10px;
  border: 2px solid #00B4DD;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 180, 221, 0.1);
    border-color: #00B4DD; /* Оставляем голубой бордер */
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/**
 * Текст кнопки экспорта
 */
const ExportButtonText = styled.span`
  color: black;
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
`;

/**
 * PageHeader компонент
 * Отображает название страницы и кнопку экспорта
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, className }) => {
  const handleExport = () => {
    console.log('Export to Excel clicked');
    // TODO: Implement Excel export functionality
  };

  return (
    <PageHeaderContainer className={className}>
      <PageTitle>{title}</PageTitle>
      <ExportButton onClick={handleExport} aria-label="Export to Excel">
        <ExportButtonText>Выгрузить в Excel</ExportButtonText>
      </ExportButton>
    </PageHeaderContainer>
  );
};
