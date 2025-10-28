// Страница добавления исполнителя
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Header, PageHeader } from '@/shared/ui';
import { fetchExecutors, createExecutor, type CreateExecutorRequest } from '@/shared/api/metrics';
import plusIcon from '@/assets/plus.svg';
import minusIcon from '@/assets/minus.svg';
import arrightIcon from '@/assets/arright.svg';
import arleftIcon from '@/assets/arleft.svg';

const AddUserContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 124px 0 0 0; /* компенсируем фиксированный Header (124px) */
  box-sizing: border-box;
`;

const AddUserContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
  box-sizing: border-box;
`;

const TableWrapper = styled.div`
  width: 1200px;
  margin: 39px auto 0 auto;
  background: #C9C9C9;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-sizing: border-box;
  background: #C9C9C9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  gap: 8px;
`;

const HeaderCell = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #C9C9C9;
`;

const TableRow = styled.div<{ $roundedBottom?: boolean }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-sizing: border-box;
  background: #D9D9D9;
  border-bottom-left-radius: ${({ $roundedBottom }) => ($roundedBottom ? '10px' : '0')};
  border-bottom-right-radius: ${({ $roundedBottom }) => ($roundedBottom ? '10px' : '0')};
  gap: 8px;
`;

const InputField = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 8px;
  border: none;
  outline: none;
  padding: 0 8px;
  color: black;
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  box-sizing: border-box;
`;

const SelectField = styled.select<{ $isPlaceholder?: boolean }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 8px;
  border: none;
  outline: none;
  padding: 0 8px;
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? '#6B6B6B' : 'black')};
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  box-sizing: border-box;
  appearance: none;

  & option[disabled] {
    color: #6B6B6B;
  }
`;

const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.15s ease;
  padding: 0;
  
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const IconButton = styled(PlusButton)``;

const CellText = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  font-size: 16px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  outline: 1px #BCBCBC solid;
  outline-offset: -0.5px;
`;

const ClickableCellText = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  font-size: 16px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #00B4DD;
  }
`;

const ThinDivider = styled.div`
  width: 100%;
  height: 0.5px;
  outline: 1px #BCBCBC solid;
  outline-offset: -0.25px;
`;

const FieldBox = styled.div`
  width: 100%;
  height: 40px;
  margin: 0;
  background: #C2C2C2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 8px;
`;

const PaginationBar = styled.div`
  width: 1200px;
  margin: 12px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 2px #C8C8C8 solid;
  background: transparent;
  padding: 8px 16px;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):hover { transform: translateY(-1px); }
`;

const PageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 2px #C8C8C8 solid;
  padding: 2px 16px;
  min-height: 48px;
  min-width: 64px;
  cursor: pointer;
  user-select: none;
`;

const PageNumber = styled.div`
  color: #C8C8C8;
  font-size: 36px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
`;

const Dots = styled.span`
  color: #C8C8C8;
  font-size: 24px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  margin: 0 8px;
`;

const CenterPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
`;

const PageInputBox = styled(PageBox)`
  cursor: text;
  border-color: #00B4DD;
  background: #EFEFEF;
`;

const PageInput = styled.input`
  width: 56px;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  color: black;
  font-size: 36px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  
  &::placeholder {
    color: #9E9E9E;
  }
`;

// Parameter selection modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 24px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  color: #333333;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 2px solid #C8C8C8;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  margin-bottom: 16px;
  box-sizing: border-box;
  background: #FFFFFF;
  color: #333333;
  
  &:focus {
    outline: none;
    border-color: #00B4DD;
    box-shadow: 0 0 0 3px rgba(0, 180, 221, 0.1);
  }
  
  &::placeholder {
    color: #9E9E9E;
  }
`;

const ParameterList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background: #FAFAFA;
`;

const ParameterItem = styled.label`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #F0F0F0;
  color: #333333;
  font-size: 16px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F5F5F5;
  }
  
  &:active {
    background: #EEEEEE;
  }
`;

const Checkbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #00B4DD;
  cursor: pointer;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: 2px solid #C8C8C8;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  color: #333333;
  transition: all 0.2s ease;
  
  &:hover {
    background: #F5F5F5;
    border-color: #00B4DD;
  }
  
  &.primary {
    background: #00B4DD;
    border-color: #00B4DD;
    color: white;
    
    &:hover {
      background: #0099C7;
    border-color: #0099C7;
    }
  }
`;

const ParameterOperationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ParameterOperationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 2px solid #C8C8C8;
  border-radius: 8px;
  background: #FAFAFA;
  gap: 12px;
`;

const ParameterName = styled.div`
  font-size: 16px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #333333;
  font-weight: 500;
  flex: 1;
`;

const XText = styled.div`
  font-size: 18px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #333333;
  font-weight: 600;
  margin: 0 8px;
`;

const OperationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ValueInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #C8C8C8;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FFFFFF;
  color: #333333;
  width: 100px;
  
  /* Remove spinner arrows */
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &:focus {
    outline: none;
    border-color: #00B4DD;
    box-shadow: 0 0 0 3px rgba(0, 180, 221, 0.1);
  }
  
  &::placeholder {
    color: #9E9E9E;
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RangeInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #C8C8C8;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FFFFFF;
  color: #333333;
  width: 80px;
  
  /* Remove spinner arrows */
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &:focus {
    outline: none;
    border-color: #00B4DD;
    box-shadow: 0 0 0 3px rgba(0, 180, 221, 0.1);
  }
  
  &::placeholder {
    color: #9E9E9E;
  }
`;

const RangeSeparator = styled.div`
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #333333;
  font-weight: 500;
  margin: 0 4px;
`;

const LogicalOpSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #C8C8C8;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FFFFFF;
  color: #333333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #00B4DD;
    box-shadow: 0 0 0 3px rgba(0, 180, 221, 0.1);
  }
`;

type UserStatus = 'active' | 'inactive';
type LogicalOperation = '>' | '<' | '=' | '<x<';

interface Parameter {
  id: number;
  name: string;
  type: string;
}

interface UserRow {
  id: number;
  name: string;
  status: UserStatus;
  order_count: number;
  parameters: Array<{
    id: number;
    operation: LogicalOperation;
    value: string;
    minValue?: string;
    maxValue?: string;
  }>;
}
/**
 * Страница добавления исполнителя
 * Таблица для управления пользователями с параметрами и масками
 */
export const AddUserPage: React.FC = () => {
  // Mock parameters from SettingsPage
  const [availableParameters] = useState<Parameter[]>(() => {
    const types = ['int', 'datetime', 'float', 'text', 'bool'];
    return Array.from({ length: 60 }, (_, idx) => ({
      id: idx + 1,
      name: `Параметр ${idx + 1}`,
      type: types[idx % types.length]!,
    }));
  });

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('');
  
  // Form state for new user
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserStatus, setNewUserStatus] = useState<'' | UserStatus>('');
  
  // Modal states
  const [showParameterModal, setShowParameterModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [parameterSearch, setParameterSearch] = useState<string>('');
  const [selectedParameters, setSelectedParameters] = useState<Array<{
    id: number;
    operation: LogicalOperation;
    value: string;
    minValue?: string;
    maxValue?: string;
  }>>([]);
  const [viewingUserParameters, setViewingUserParameters] = useState<Array<{
    id: number;
    operation: LogicalOperation;
    value: string;
    minValue?: string;
    maxValue?: string;
  }>>([]);
  const [viewingUserName, setViewingUserName] = useState<string>('');

  const PAGE_SIZE = 10;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(users.length / PAGE_SIZE)), [users]);

  const nextId = useMemo(() => {
    if (users.length === 0) return 1;
    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
    return maxId + 1;
  }, [users]);

  // Загрузка данных исполнителей
  useEffect(() => {
    const loadExecutors = async () => {
      try {
        setLoading(true);
        setError(null);
        const executors = await fetchExecutors();
        
        // Преобразуем данные из API в формат UserRow
        const transformedUsers: UserRow[] = executors.map(executor => ({
          id: executor.id,
          name: executor.name,
          status: executor.status,
          order_count: executor.order_count,
          parameters: executor.parameters || [],
        }));
        
        setUsers(transformedUsers);
      } catch (err) {
        console.error('Failed to load executors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load executors');
      } finally {
        setLoading(false);
      }
    };

    loadExecutors();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const filteredParameters = useMemo(() => {
    if (!parameterSearch.trim()) return availableParameters;
    return availableParameters.filter(p => 
      p.name.toLowerCase().includes(parameterSearch.toLowerCase())
    );
  }, [availableParameters, parameterSearch]);

  const paginationItems = useMemo<(number | '...')[]>(() => {
    const items: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) items.push(i);
      return items;
    }
    items.push(1, 2);
    if (totalPages > 4) items.push('...');
    items.push(totalPages - 1, totalPages);
    return items;
  }, [totalPages]);

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(totalPages, Math.floor(page)));
    setCurrentPage(p);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const num = Number(pageInput);
      if (Number.isFinite(num) && num >= 1) {
        goToPage(num);
        setPageInput('');
      }
    }
  };

  /**
   * Преобразует параметр в формат маски для API
   * > 20 -> "20x"
   * < 20 -> "x20"
   * = 20 -> "20"
   * <x< (20, 30) -> "20x30"
   */
  const convertToMask = (param: typeof selectedParameters[0]): string => {
    const { operation, value, minValue, maxValue } = param;
    
    console.log(`Converting parameter ${param.id}:`, {
      operation,
      value,
      minValue,
      maxValue
    });
    
    let mask: string;
    
    if (operation === '>') {
      mask = `${value}x`;
    } else if (operation === '<') {
      mask = `x${value}`;
    } else if (operation === '=') {
      mask = value;
    } else if (operation === '<x<') {
      mask = `${minValue}x${maxValue}`;
    } else {
      mask = value;
    }
    
    console.log(`Result mask for parameter ${param.id}:`, mask);
    return mask;
  };

  const handleAddUser = async () => {
    if (!newUserName.trim() || !newUserStatus) return;
    
    try {
      // Подготовка параметров в формате API
      const apiParameters = selectedParameters.map(param => ({
        id: param.id,
        mask: convertToMask(param)
      }));

      // Создание запроса
      const request: CreateExecutorRequest = {
        name: newUserName.trim(),
        status: newUserStatus,
        parameters: apiParameters
      };

      // Отладочная информация
      console.log('=== DEBUG: Creating Executor ===');
      console.log('Request JSON:', JSON.stringify(request, null, 2));
      console.log('Selected parameters:', selectedParameters);
      console.log('Converted API parameters:', apiParameters);
      console.log('================================');

      // Отправка на сервер
      const response = await createExecutor(request);
      console.log('Executor created with ID:', response.id);

      // Перезагрузка списка исполнителей
      const executors = await fetchExecutors();
      const transformedUsers: UserRow[] = executors.map(executor => ({
        id: executor.id,
        name: executor.name,
        status: executor.status,
        order_count: executor.order_count,
        parameters: executor.parameters || [],
      }));
      
      setUsers(transformedUsers);
      setNewUserName('');
      setNewUserStatus('');
      setSelectedParameters([]);
      
      const newTotalPages = Math.max(1, Math.ceil(transformedUsers.length / PAGE_SIZE));
      setCurrentPage(newTotalPages);
    } catch (err) {
      console.error('Failed to create executor:', err);
      alert(`Ошибка при создании исполнителя: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleRemoveUser = (id: number) => {
    const user = users.find(u => u.id === id);
    const nameLabel = user ? user.name : String(id);
    const ok = window.confirm(`Точно удалить пользователя ${nameLabel}?`);
    if (!ok) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const openParameterModal = () => {
    setShowParameterModal(true);
    setParameterSearch('');
  };

  const openViewModal = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setViewingUserParameters([...user.parameters]);
      setViewingUserName(user.name);
      setShowViewModal(true);
    }
  };

  const closeParameterModal = () => {
    setShowParameterModal(false);
    setParameterSearch('');
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingUserParameters([]);
    setViewingUserName('');
  };

  const confirmParameterSelection = () => {
    setShowParameterModal(false);
    setParameterSearch('');
  };

  const toggleParameterSelection = (paramId: number) => {
    setSelectedParameters(prev => {
      const existing = prev.find(p => p.id === paramId);
      if (existing) {
        return prev.filter(p => p.id !== paramId);
      } else {
        return [...prev, { 
          id: paramId, 
          operation: '=' as LogicalOperation, 
          value: '',
          minValue: '',
          maxValue: ''
        }];
      }
    });
  };

  const handleParameterOperationChange = (paramId: number, operation: LogicalOperation) => {
    setSelectedParameters(prev => 
      prev.map(p => p.id === paramId ? { ...p, operation } : p)
    );
  };

  const handleParameterValueChange = (paramId: number, value: string) => {
    setSelectedParameters(prev => 
      prev.map(p => p.id === paramId ? { ...p, value } : p)
    );
  };

  const handleParameterMinValueChange = (paramId: number, minValue: string) => {
    setSelectedParameters(prev => 
      prev.map(p => p.id === paramId ? { ...p, minValue } : p)
    );
  };

  const handleParameterMaxValueChange = (paramId: number, maxValue: string) => {
    setSelectedParameters(prev => 
      prev.map(p => p.id === paramId ? { ...p, maxValue } : p)
    );
  };

  const getParameterName = (id: number) => {
    return availableParameters.find(p => p.id === id)?.name || `Параметр ${id}`;
  };

  if (loading) {
    return (
      <AddUserContainer>
        <Header />
        <PageHeader title="Добавить исполнителя" />
        <AddUserContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            fontSize: '18px',
            color: '#666666'
          }}>
            Загрузка исполнителей...
          </div>
        </AddUserContent>
      </AddUserContainer>
    );
  }

  if (error) {
    return (
      <AddUserContainer>
        <Header />
        <PageHeader title="Добавить исполнителя" />
        <AddUserContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            fontSize: '18px',
            color: '#ff4444',
            textAlign: 'center',
            padding: '20px'
          }}>
            Ошибка загрузки: {error}
          </div>
        </AddUserContent>
      </AddUserContainer>
    );
  }

  return (
    <AddUserContainer>
      <Header />
      <PageHeader title="Добавить исполнителя" />
      <AddUserContent>
        <TableWrapper>
          <TableHeader>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Имя</HeaderCell>
            <HeaderCell>Статус</HeaderCell>
            <HeaderCell>Параметры</HeaderCell>
            <HeaderCell>Действие</HeaderCell>
          </TableHeader>
          <Divider />
          <TableRow>
            <CellText>{nextId}</CellText>
            <FieldBox>
              <InputField
                placeholder="Введите имя"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </FieldBox>
            <FieldBox>
              <SelectField
                value={newUserStatus}
                onChange={(e) => setNewUserStatus(e.target.value as '' | UserStatus)}
                $isPlaceholder={newUserStatus === ''}
              >
                <option value="" disabled>Статус</option>
                <option value="active">Активный</option>
                <option value="inactive">Неактивный</option>
              </SelectField>
            </FieldBox>
            <FieldBox>
              <InputField
                placeholder="Выбрать параметры"
                value={selectedParameters.length > 0 ? `${selectedParameters.length} параметров выбрано` : ''}
                readOnly
                onClick={openParameterModal}
                style={{ cursor: 'pointer' }}
              />
            </FieldBox>
            <PlusButton onClick={handleAddUser}>
              <img src={plusIcon} alt="Добавить" width={34} height={34} />
            </PlusButton>
          </TableRow>
          {users
            .slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE)
            .map((user, idx, arr) => (
            <React.Fragment key={user.id}>
              <ThinDivider />
              <TableRow $roundedBottom={idx === arr.length - 1}>
                <CellText>{user.id}</CellText>
                <CellText>{user.name}</CellText>
                <CellText>{user.status === 'active' ? 'Активный' : 'Неактивный'}</CellText>
                <ClickableCellText onClick={() => openViewModal(user.id)}>
                  {user.parameters.length > 0 ? `${user.parameters.length} параметров` : 'Нет параметров'}
                </ClickableCellText>
                <IconButton onClick={() => handleRemoveUser(user.id)}>
                  <img src={minusIcon} alt="Удалить" width={34} height={34} />
                </IconButton>
              </TableRow>
            </React.Fragment>
          ))}
        </TableWrapper>
        
        {users.length > PAGE_SIZE && (
          <PaginationBar>
            <ArrowButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <img src={arleftIcon} alt="Назад" />
            </ArrowButton>

            <CenterPagination>
              {paginationItems.map((item, idx) => {
                if (item === '...') return <Dots key={`dots-${idx}`}>...</Dots>;
                return (
                  <PageBox key={item} onClick={() => goToPage(item)}>
                    <PageNumber>{item}</PageNumber>
                  </PageBox>
                );
              })}
              <PageInputBox>
                <PageInput
                  placeholder={String(currentPage)}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={handleInputKeyDown}
                />
              </PageInputBox>
            </CenterPagination>

            <ArrowButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <img src={arrightIcon} alt="Вперед" />
            </ArrowButton>
          </PaginationBar>
        )}

        {/* Unified Parameter Selection Modal */}
        {showParameterModal && (
          <ModalOverlay onClick={closeParameterModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Выберите параметры и настройте операции</ModalTitle>
              <SearchInput
                placeholder="Поиск параметров..."
                value={parameterSearch}
                onChange={(e) => setParameterSearch(e.target.value)}
              />
              <ParameterList>
                {filteredParameters.map(param => (
                  <ParameterItem key={param.id}>
                    <Checkbox
                      type="checkbox"
                      checked={selectedParameters.some(p => p.id === param.id)}
                      onChange={() => toggleParameterSelection(param.id)}
                    />
                    <span>{param.name} ({param.type})</span>
                  </ParameterItem>
                ))}
              </ParameterList>
              
              {selectedParameters.length > 0 && (
                <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: '500', fontSize: '16px' }}>
                    Настройка операций для выбранных параметров:
                  </div>
                  <ParameterOperationList>
                    {selectedParameters.map(param => (
                      <ParameterOperationItem key={param.id}>
                        <ParameterName>{getParameterName(param.id)}</ParameterName>
                        <XText>X</XText>
                        <OperationContainer>
                          <LogicalOpSelect
                            value={param.operation}
                            onChange={(e) => handleParameterOperationChange(param.id, e.target.value as LogicalOperation)}
                          >
                            <option value=">">Больше (&gt;)</option>
                            <option value="<">Меньше (&lt;)</option>
                            <option value="=">Равно (=)</option>
                            <option value="<x<">Диапазон (≤x≤)</option>
                          </LogicalOpSelect>
                          {param.operation === '<x<' ? (
                            <RangeContainer>
                              <RangeInput
                                type="number"
                                placeholder="Мин"
                                value={param.minValue || ''}
                                onChange={(e) => handleParameterMinValueChange(param.id, e.target.value)}
                              />
                              <RangeSeparator>≤ X ≤</RangeSeparator>
                              <RangeInput
                                type="number"
                                placeholder="Макс"
                                value={param.maxValue || ''}
                                onChange={(e) => handleParameterMaxValueChange(param.id, e.target.value)}
                              />
                            </RangeContainer>
                          ) : (
                            <ValueInput
                              type="number"
                              placeholder="Значение"
                              value={param.value}
                              onChange={(e) => handleParameterValueChange(param.id, e.target.value)}
                            />
                          )}
                        </OperationContainer>
                      </ParameterOperationItem>
                    ))}
                  </ParameterOperationList>
                </div>
              )}
              
              <ModalButtons>
                <ModalButton onClick={closeParameterModal}>Отмена</ModalButton>
                <ModalButton className="primary" onClick={confirmParameterSelection}>
                  Применить ({selectedParameters.length})
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* View Parameters Modal */}
        {showViewModal && (
          <ModalOverlay onClick={closeViewModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Параметры пользователя: {viewingUserName}</ModalTitle>
              
              {viewingUserParameters.length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <ParameterOperationList>
                    {viewingUserParameters.map(param => (
                      <ParameterOperationItem key={param.id}>
                        <ParameterName>{getParameterName(param.id)}</ParameterName>
                        <XText>X</XText>
                        <OperationContainer>
                          <div style={{ 
                            padding: '8px 12px', 
                            border: '2px solid #C8C8C8', 
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            background: '#F5F5F5',
                            color: '#333333',
                            minWidth: '120px'
                          }}>
                            {param.operation === '>' ? 'Больше (>)' : 
                             param.operation === '<' ? 'Меньше (<)' : 
                             param.operation === '=' ? 'Равно (=)' : 
                             'Диапазон (≤x≤)'}
                          </div>
                        <div style={{ 
                          padding: '8px 12px', 
                          border: '2px solid #C8C8C8', 
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          background: '#F5F5F5',
                          color: '#333333',
                          width: '100px',
                          textAlign: 'center'
                        }}>
                          {param.operation === '<x<' 
                            ? `${param.minValue || '—'} ≤ X ≤ ${param.maxValue || '—'}`
                            : (param.value || '—')
                          }
                        </div>
                        </OperationContainer>
                      </ParameterOperationItem>
                    ))}
                  </ParameterOperationList>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  marginBottom: '24px',
                  color: '#666666',
                  fontSize: '16px',
                  fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                }}>
                  У пользователя нет настроенных параметров
                </div>
              )}
              
              <ModalButtons>
                <ModalButton onClick={closeViewModal}>Закрыть</ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </AddUserContent>
    </AddUserContainer>
  );
};
