// Заголовок приложения с логотипом и навигацией
import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.svg';
import logoText from '@/assets/logo-text.svg';
import chartsIcon from '@/assets/charts.svg';
import settingsIcon from '@/assets/settings.svg';
import userIcon from '@/assets/user.svg';

interface HeaderProps {
  className?: string;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 124px; /* фиксированная высота: 60 + 32 + 32 для стабильности */
  padding: 32px 32px; /* одинаковый паддинг сверху и снизу, без просветов */
  background-color: #ffffff;
  box-sizing: border-box;
  position: fixed; /* фиксируем хедер для исключения скачков */
  top: 0;
  z-index: 1000;
`;

/**
 * Контейнер для левой части с логотипом FairTask
 */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Логотип FairTask
 */
const FairTaskLogo = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
`;

/**
 * Логотип Zunami
 */
const ZunamiLogo = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

/**
 * Контейнер для центральных кнопок
 */
const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 50%; /* Центрируем по горизонтали */
  transform: translateX(-50%);
`;

/**
 * Стилизованная кнопка с рамкой
 */
const WorkingButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid #C8C8C8;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    border-color: #00B4DD;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

/**
 * Иконка внутри кнопки
 */
const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  pointer-events: none; /* Делаем иконку не кликабельной */
`;

 


/**
 * Контейнер для правой части с логотипом
 */
const RightSection = styled.div`
  display: flex;
  align-items: center;
`;


/**
 * Header компонент приложения
 * Содержит логотип FairTask слева, кнопки навигации в центре и логотип справа
 */
export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleChartsClick = () => {
    navigate('/dashboard');
  };

  const handleAddUserClick = () => {
    navigate('/adduser');
  };

  const isSettingsActive = location.pathname === '/settings';
  const isDashboardActive = location.pathname === '/dashboard';
  const isAddUserActive = location.pathname === '/adduser';

  return (
    <HeaderContainer className={className}>
      {/* Левая часть - логотип FairTask */}
      <LeftSection>
        <FairTaskLogo src={logoText} alt="FairTask" />
      </LeftSection>

      {/* Центральная часть - кнопки */}
      <CenterSection>
        <WorkingButton 
          onClick={handleChartsClick}
          aria-label="Dashboard"
          style={{ 
            borderColor: isDashboardActive ? '#00B4DD' : '#C8C8C8',
            backgroundColor: isDashboardActive ? 'rgba(0, 180, 221, 0.1)' : 'transparent'
          }}
        >
          <ButtonIcon src={chartsIcon} alt="Dashboard" />
        </WorkingButton>
        <WorkingButton 
          onClick={handleSettingsClick}
          aria-label="Parameters"
          style={{ 
            borderColor: isSettingsActive ? '#00B4DD' : '#C8C8C8',
            backgroundColor: isSettingsActive ? 'rgba(0, 180, 221, 0.1)' : 'transparent'
          }}
        >
          <ButtonIcon src={settingsIcon} alt="Parameters" />
        </WorkingButton>
        <WorkingButton 
          onClick={handleAddUserClick}
          aria-label="Executors"
          style={{ 
            borderColor: isAddUserActive ? '#00B4DD' : '#C8C8C8',
            backgroundColor: isAddUserActive ? 'rgba(0, 180, 221, 0.1)' : 'transparent'
          }}
        >
          <ButtonIcon src={userIcon} alt="Executors" />
        </WorkingButton>
        
      </CenterSection>

      {/* Правая часть - логотип */}
      <RightSection>
        <ZunamiLogo 
          src={logoImage} 
          alt="Zunami Logo"
        />
      </RightSection>
    </HeaderContainer>
  );
};
