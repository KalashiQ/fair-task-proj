// Заголовок страницы с кнопкой экспорта
import React from 'react';
import styled from 'styled-components';
import * as XLSX from 'xlsx';

interface PageHeaderProps {
  title: string;
  className?: string;
}

const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 64px); /* Вычитаем боковые отступы */
  height: 80px;
  padding: 0 20px;
  margin: 16px 32px 0 32px; /* Отступ сверху, чтобы не слипалось с Header */
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
 * Функция для экспорта всех данных в Excel
 */
const exportToExcel = async () => {
  try {
    // Импортируем функции API динамически, чтобы избежать циклических зависимостей
    const { fetchOrderCount, fetchExecutors, fetchParameters } = await import('@/shared/api/metrics');
    
    console.log('Starting Excel export...');
    
    // Создаем новую рабочую книгу
    const workbook = XLSX.utils.book_new();
    
    // 1. Dashboard статистика
    try {
      const dashboardData = await Promise.all([
        fetchOrderCount('hour'),
        fetchOrderCount('day'), 
        fetchOrderCount('week')
      ]);
      
      const dashboardSheet = [
        ['Период', 'Количество заявок'],
        ['За последний час', String(dashboardData[0].reduce((sum, item) => sum + item.count, 0))],
        ['За последний день', String(dashboardData[1].reduce((sum, item) => sum + item.count, 0))],
        ['За последнюю неделю', String(dashboardData[2].reduce((sum, item) => sum + item.count, 0))]
      ];
      
      const dashboardWS = XLSX.utils.aoa_to_sheet(dashboardSheet);
      XLSX.utils.book_append_sheet(workbook, dashboardWS, 'Dashboard');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    
    // 2. Исполнители (AddUserPage)
    try {
      const executors = await fetchExecutors();
      const executorsSheet = [
        ['ID', 'Имя', 'Статус', 'Количество заявок', 'Количество параметров']
      ];
      
      executors.forEach(executor => {
        executorsSheet.push([
          String(executor.id),
          executor.name,
          executor.status === 'active' ? 'Активный' : 'Неактивный',
          String(executor.order_count),
          String(executor.parameters?.length || 0)
        ]);
      });
      
      const executorsWS = XLSX.utils.aoa_to_sheet(executorsSheet);
      XLSX.utils.book_append_sheet(workbook, executorsWS, 'Исполнители');
    } catch (error) {
      console.error('Error fetching executors data:', error);
    }
    
    // 3. Параметры (SettingsPage)
    try {
      const parameters = await fetchParameters();
      const parametersSheet = [
        ['ID', 'Название параметра', 'Тип']
      ];
      
      parameters.forEach(param => {
        parametersSheet.push([
          String(param.id),
          param.name,
          param.type
        ]);
      });
      
      const parametersWS = XLSX.utils.aoa_to_sheet(parametersSheet);
      XLSX.utils.book_append_sheet(workbook, parametersWS, 'Параметры');
    } catch (error) {
      console.error('Error fetching parameters data:', error);
    }
    
    // 4. Детальная статистика по периодам
    try {
      const detailedStats = await Promise.all([
        fetchOrderCount('hour'),
        fetchOrderCount('day'),
        fetchOrderCount('week')
      ]);
      
      const detailedSheet = [
        ['Период', 'Время', 'Количество заявок']
      ];
      
      // Часовые данные
      detailedStats[0].forEach(item => {
        const date = new Date(item.ts);
        detailedSheet.push([
          'Час',
          date.toLocaleString('ru-RU'),
          String(item.count)
        ]);
      });
      
      // Дневные данные
      detailedStats[1].forEach(item => {
        const date = new Date(item.ts);
        detailedSheet.push([
          'День',
          date.toLocaleString('ru-RU'),
          String(item.count)
        ]);
      });
      
      // Недельные данные
      detailedStats[2].forEach(item => {
        const date = new Date(item.ts);
        detailedSheet.push([
          'Неделя',
          date.toLocaleString('ru-RU'),
          String(item.count)
        ]);
      });
      
      const detailedWS = XLSX.utils.aoa_to_sheet(detailedSheet);
      XLSX.utils.book_append_sheet(workbook, detailedWS, 'Детальная статистика');
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    }
    
    // Генерируем имя файла с текущей датой
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = `fairtask_statistics_${dateStr}.xlsx`;
    
    // Сохраняем файл
    XLSX.writeFile(workbook, fileName);
    
    console.log('Excel export completed successfully');
    alert('Статистика успешно выгружена в Excel!');
    
  } catch (error) {
    console.error('Error during Excel export:', error);
    alert('Ошибка при выгрузке статистики: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
  }
};

/**
 * PageHeader компонент
 * Отображает название страницы и кнопку экспорта
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, className }) => {
  const handleExport = () => {
    exportToExcel();
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
