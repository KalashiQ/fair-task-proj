import React from 'react';
import styled from 'styled-components';
import { AuthForm } from '@/widgets/AuthForm';

const AuthPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
`;

export const AuthPage: React.FC = () => {
  return (
    <AuthPageContainer>
      <AuthForm />
    </AuthPageContainer>
  );
};
