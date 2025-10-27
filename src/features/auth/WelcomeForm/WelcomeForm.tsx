import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatedButton } from '@/shared/ui';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  max-width: 300px;
  justify-content: center;
  align-items: center;
`;

const FormTitle = styled.h2`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 20px 0;
`;

const InputField = styled.input`
  padding: 12px 16px;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: #007BFF;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;


export const WelcomeForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: keyof RegisterFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    console.log('Register data:', formData);
  };

  return (
    <RegisterFormContainer onSubmit={handleSubmit}>
      <FormTitle>Регистрация</FormTitle>
      
      <InputField
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange('email')}
        required
      />
      
      <InputField
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleInputChange('password')}
        required
      />
      
      <InputField
        type="password"
        placeholder="Подтвердите пароль"
        value={formData.confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        required
      />
      
      <AnimatedButton
        text="Зарегистрироваться"
        type="submit"
        width={224}
        height={47}
        fontSize={16}
        fontWeight={600}
        borderRadius={4}
        backgroundColor="#FFFFFF"
        hoverBackgroundColor="transparent"
        textColor="#6D6D6D"
        hoverTextColor="#FFFFFF"
        outlineColor="#FFFFFF"
        fontFamily="Inter"
        lineHeight="22px"
        transitionDuration="220ms ease"
      />
    </RegisterFormContainer>
  );
};
