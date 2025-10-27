import React, { useState } from 'react';
import styled from 'styled-components';
import logoImage from '@/assets/logo.svg';
import chartsIcon from '@/assets/charts.svg';
import settingsIcon from '@/assets/settings.svg';
import sunIcon from '@/assets/sun.svg';
import moonIcon from '@/assets/moon.svg';

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
 * Текст логотипа FairTask
 */
const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

/**
 * Контейнер для центральных кнопок
 */
const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: absolute;
  left: 40%; /* Сдвигаем левее от центра */
  transform: translateX(-50%);
`;

/**
 * Контейнер для кнопки темы
 */
const ThemeSection = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: calc(40% + 260px); /* Сдвигаем правее от всех кнопок (5 кнопок * 52px) */
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
 * Кнопка смены темы
 */
const ThemeToggleButton = styled.button<{ isDark: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid #C8C8C8;
  background-color: ${props => props.isDark ? '#BABABA' : 'transparent'};
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
 * Контейнер для правой части с логотипом
 */
const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Логотип изображение
 */
const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

/**
 * Header компонент приложения
 * Содержит кнопку смены темы, логотип FairTask слева, кнопки в центре и логотип справа
 */
export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    console.log(`Theme switched to: ${!isDarkTheme ? 'dark' : 'light'}`);
  };

  return (
    <HeaderContainer className={className}>
      {/* Левая часть - логотип FairTask */}
      <LeftSection>
        <LogoText>FairTask</LogoText>
      </LeftSection>

      {/* Центральная часть - кнопки */}
      <CenterSection>
        <WorkingButton 
          onClick={() => console.log('Settings button clicked')}
          aria-label="Settings"
        >
          <ButtonIcon src={settingsIcon} alt="Settings" />
        </WorkingButton>
        <WorkingButton 
          onClick={() => console.log('Charts button clicked')}
          aria-label="Charts"
        >
          <ButtonIcon src={chartsIcon} alt="Charts" />
        </WorkingButton>
        <PlaceholderButton aria-label="Placeholder button 1" />
        <PlaceholderButton aria-label="Placeholder button 2" />
        <PlaceholderButton aria-label="Placeholder button 3" />
      </CenterSection>

      {/* Кнопка темы */}
      <ThemeSection>
        <ThemeToggleButton 
          isDark={isDarkTheme}
          onClick={toggleTheme}
          aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <ButtonIcon 
            src={isDarkTheme ? moonIcon : sunIcon} 
            alt={isDarkTheme ? 'Moon' : 'Sun'} 
          />
        </ThemeToggleButton>
      </ThemeSection>

      {/* Правая часть - логотип */}
      <RightSection>
        <LogoImage 
          src={logoImage} 
          alt="Zunami Logo"
        />
      </RightSection>
    </HeaderContainer>
  );
};
