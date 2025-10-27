import React, { useState } from 'react';
import styled from 'styled-components';
import type { AnimatedButtonProps } from '@/shared/types/button';

const StyledButton = styled.button<{
  $isHovered: boolean;
  $width: number;
  $height: number;
  $fontSize: number;
  $fontWeight: number;
  $borderRadius: number;
  $backgroundColor: string;
  $hoverBackgroundColor: string;
  $textColor: string;
  $hoverTextColor: string;
  $outlineColor: string;
  $fontFamily: string;
  $lineHeight: string;
  $transitionDuration: string;
}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  border-radius: ${props => props.$borderRadius}px;
  background: ${props => props.$isHovered ? props.$hoverBackgroundColor : props.$backgroundColor};
  color: ${props => props.$isHovered ? props.$hoverTextColor : props.$textColor};
  outline: 2px ${props => props.$outlineColor} solid;
  outline-offset: -2px;
  font-family: ${props => props.$fontFamily};
  font-size: ${props => props.$fontSize}px;
  font-weight: ${props => props.$fontWeight};
  line-height: ${props => props.$lineHeight};
  transition: background-color ${props => props.$transitionDuration}, color ${props => props.$transitionDuration};
  cursor: pointer;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transform: none;
  transform-style: flat;
  -webkit-transform-style: flat;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  will-change: background-color, color;
  isolation: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text = 'Кнопка',
  width = 168,
  height = 48,
  fontSize = 15,
  fontWeight = 400,
  borderRadius = 20,
  backgroundColor = '#FF5A00',
  hoverBackgroundColor = 'transparent',
  textColor = '#FFFFFF',
  hoverTextColor = '#FF5A00',
  outlineColor = '#FF5A00',
  fontFamily = 'Inter',
  lineHeight = '22px',
  transitionDuration = '220ms ease',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <StyledButton
      type={type}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      $isHovered={isHovered}
      $width={width}
      $height={height}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $borderRadius={borderRadius}
      $backgroundColor={backgroundColor}
      $hoverBackgroundColor={hoverBackgroundColor}
      $textColor={textColor}
      $hoverTextColor={hoverTextColor}
      $outlineColor={outlineColor}
      $fontFamily={fontFamily}
      $lineHeight={lineHeight}
      $transitionDuration={transitionDuration}
    >
      {text}
    </StyledButton>
  );
};
