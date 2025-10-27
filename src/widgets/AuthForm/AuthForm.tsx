import React, { useState } from 'react';
import styled from 'styled-components';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { AnimatedButton } from '@/shared/ui';

const Container = styled.div<{ $isRightPanelActive: boolean }>`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 15px 20px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  width: 986px;
  height: 536px;
  font-family: 'Inter', sans-serif;
  
  &.right-panel-active {
    .sign-in-container {
      transform: translateX(100%);
      opacity: 0;
      z-index: 1;
    }
    
    .sign-up-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: show 0.6s;
    }
    
    .overlay-container {
      transform: translateX(-100%);
    }
    
    .overlay {
      transform: translateX(50%);
    }
    
    .overlay-left {
      transform: translateX(0);
    }
    
    .overlay-right {
      transform: translateX(0);
    }
  }
  
  @keyframes show {
    0%, 49.99% {
      opacity: 0;
      z-index: 1;
    }
    
    50%, 100% {
      opacity: 1;
      z-index: 5;
    }
  }
`;

const FormContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
`;

const SignInContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  z-index: 2;
`;

const SignUpContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
`;

const Overlay = styled.div`
  background: linear-gradient(to right, #FF5A00);
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  box-sizing: border-box;
`;

const OverlayLeft = styled(OverlayPanel)`
  transform: translateX(0);
`;

const OverlayRight = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
`;

const OverlayTitle = styled.h1`
  font-size: 36px;
  font-family: 'Inter';
  font-weight: 400;
  word-wrap: break-word;
  margin: 0 0 20px 0;
`;

const OverlayText = styled.p`
  font-size: 20px;
  font-family: 'Inter';
  font-weight: 400;
  word-wrap: break-word;
  margin: 0 0 30px 0;
`;

const OverlayQuestion = styled.div`
  font-size: 18px;
  font-family: 'Inter';
  font-weight: 400;
  word-wrap: break-word;
  margin: 0 0 20px 0;
  text-align: center;
`;


export const AuthForm: React.FC = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <Container 
      $isRightPanelActive={isRightPanelActive}
      className={isRightPanelActive ? 'right-panel-active' : ''}
    >
      <SignInContainer className="sign-in-container">
        <LoginForm />
      </SignInContainer>

      <SignUpContainer className="sign-up-container">
        <RegisterForm />
      </SignUpContainer>

      <OverlayContainer className="overlay-container">
        <Overlay className="overlay">
          <OverlayRight className="overlay-right">
            <OverlayTitle>С возвращением!</OverlayTitle>
            <OverlayText>Пожалуйста, введите вашу почту и пароль</OverlayText>
            <OverlayQuestion>Нет аккаунта?</OverlayQuestion>
            <AnimatedButton
              text="Создать аккаунт"
              onClick={handleSignUpClick}
              width={227}
              height={47}
              fontSize={20}
              fontWeight={400}
              borderRadius={35}
              backgroundColor="#FF5A00"
              hoverBackgroundColor="#FFFFFF"
              textColor="#FFFFFF"
              hoverTextColor="#FF5A00"
              outlineColor="#FFFFFF"
              fontFamily="Inter"
              lineHeight="22px"
              transitionDuration="220ms ease"
            />
          </OverlayRight>
          
          <OverlayLeft className="overlay-left">
            <OverlayTitle>Добро пожаловать!</OverlayTitle>
            <OverlayText>Пожалуйста, введите вашу почту и пароль</OverlayText>
            <OverlayQuestion>Есть аккаунт?</OverlayQuestion>
            <AnimatedButton
              text="Войти"
              onClick={handleSignInClick}
              width={120}
              height={47}
              fontSize={20}
              fontWeight={400}
              borderRadius={35}
              backgroundColor="#FF5A00"
              hoverBackgroundColor="#FFFFFF"
              textColor="#FFFFFF"
              hoverTextColor="#FF5A00"
              outlineColor="#FFFFFF"
              fontFamily="Inter"
              lineHeight="22px"
              transitionDuration="220ms ease"
            />
          </OverlayLeft>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};
