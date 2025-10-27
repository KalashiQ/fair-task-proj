import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.svg';
import logoText from '@/assets/logo-text.svg';
import chartsIcon from '@/assets/charts.svg';
import settingsIcon from '@/assets/settings.svg';

/**
 * Интерфейс для пропсов Header компонента
 */
interface HeaderProps {
  className?: string;
}

/**
 * Стилизованный контейнер для Header
 */
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 64px); /* Вычитаем боковые отступы */
  height: 60px;
  padding: 0 20px;
  margin: 32px 32px 0 32px; /* Отступ сверху и по бокам */
  background-color: #ffffff;
  box-sizing: border-box;
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
 * Стилизованная кнопка-заглушка
 */
const PlaceholderButton = styled.div`
  width: 40px;
  height: 40px;
  background-color: #BABABA;
  border-radius: 5px;
  cursor: not-allowed;
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

  const isSettingsActive = location.pathname === '/settings';
  const isDashboardActive = location.pathname === '/dashboard';

  return (
    <HeaderContainer className={className}>
      {/* Левая часть - логотип FairTask */}
      <LeftSection>
        <FairTaskLogo src={logoText} alt="FairTask" />
      </LeftSection>

      {/* Центральная часть - кнопки */}
      <CenterSection>
        <WorkingButton 
          onClick={handleSettingsClick}
          aria-label="Settings"
          style={{ 
            borderColor: isSettingsActive ? '#00B4DD' : '#C8C8C8',
            backgroundColor: isSettingsActive ? 'rgba(0, 180, 221, 0.1)' : 'transparent'
          }}
        >
          <ButtonIcon src={settingsIcon} alt="Settings" />
        </WorkingButton>
        <WorkingButton 
          onClick={handleChartsClick}
          aria-label="Charts"
          style={{ 
            borderColor: isDashboardActive ? '#00B4DD' : '#C8C8C8',
            backgroundColor: isDashboardActive ? 'rgba(0, 180, 221, 0.1)' : 'transparent'
          }}
        >
          <ButtonIcon src={chartsIcon} alt="Charts" />
        </WorkingButton>
        <PlaceholderButton aria-label="Placeholder button 1" />
        <PlaceholderButton aria-label="Placeholder button 2" />
        <PlaceholderButton aria-label="Placeholder button 3" />
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
