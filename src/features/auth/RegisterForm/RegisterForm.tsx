import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatedButton } from '@/shared/ui';

interface RegisterFormData {
  name: string;
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
  padding: 40px;
  border-radius: 15px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;

const FormTitle = styled.h2`
  color: black;
  font-size: 36px;
  font-family: 'Inter';
  font-weight: 400;
  word-wrap: break-word;
  text-align: center;
  margin: 0 0 20px 0;
`;

const InputField = styled.input`
  width: 306px;
  height: 42px;
  background: #E0E0E0;
  border-radius: 10px;
  padding: 0 16px;
  border: none;
  font-size: 20px;
  font-family: 'Inter';
  font-weight: 400;
  word-wrap: break-word;
  color: #808080;
  box-sizing: border-box;
  
  &::placeholder {
    color: #808080;
  }
  
  &:focus {
    outline: none;
    border-color: #007BFF;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 306px;
`;

const PasswordField = styled(InputField)`
  padding-right: 50px;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #000000;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #FF5A00;
  }
`;


export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <RegisterFormContainer onSubmit={handleSubmit}>
      <FormTitle>Создать аккаунт</FormTitle>
      
      <InputField
        type="text"
        placeholder="Имя"
        value={formData.name}
        onChange={handleInputChange('name')}
        required
      />
      
      <InputField
        type="email"
        placeholder="Почта"
        value={formData.email}
        onChange={handleInputChange('email')}
        required
      />
      
      <PasswordContainer>
        <PasswordField
          type={showPassword ? "text" : "password"}
          placeholder="Пароль"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
        />
        <ToggleButton
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          {showPassword ? "●" : "○"}
        </ToggleButton>
      </PasswordContainer>
      
      <PasswordContainer>
        <PasswordField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Подтвердить пароль"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          required
        />
        <ToggleButton
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          {showConfirmPassword ? "●" : "○"}
        </ToggleButton>
      </PasswordContainer>
      
      <AnimatedButton
        text="Создать аккаунт"
        type="submit"
        width={224}
        height={47}
        fontSize={20}
        fontWeight={400}
        borderRadius={35}
        backgroundColor="#FF5A00"
        hoverBackgroundColor="transparent"
        textColor="#FFFFFF"
        hoverTextColor="#FF5A00"
        outlineColor="#FF5A00"
        fontFamily="Inter"
        lineHeight="22px"
        transitionDuration="220ms ease"
      />
    </RegisterFormContainer>
  );
};
