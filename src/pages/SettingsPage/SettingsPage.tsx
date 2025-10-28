import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header, PageHeader } from '@/shared/ui';
import { fetchParameters, createParameter, deleteParameter, type Parameter, type CreateParameterRequest } from '@/shared/api/metrics';
import plusIcon from '@/assets/plus.svg';
import minusIcon from '@/assets/minus.svg';
import arrightIcon from '@/assets/arright.svg';
import arleftIcon from '@/assets/arleft.svg';

const SettingsContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 124px 0 0 0; /* компенсируем фиксированный Header (124px) */
  box-sizing: border-box;
`;

const SettingsContent = styled.div`
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
  grid-template-columns: 160px 1fr 1fr 160px;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-sizing: border-box;
  background: #C9C9C9;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const HeaderCell = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  font-size: 24px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #C9C9C9;
`;

const ClickableHeaderCell = styled(HeaderCell)`
  cursor: pointer;
  user-select: none;
`;

const TableRow = styled.div<{ $roundedBottom?: boolean }>`
  display: grid;
  grid-template-columns: 160px 1fr 1fr 160px;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  box-sizing: border-box;
  background: #D9D9D9;
  border-bottom-left-radius: ${({ $roundedBottom }) => ($roundedBottom ? '10px' : '0')};
  border-bottom-right-radius: ${({ $roundedBottom }) => ($roundedBottom ? '10px' : '0')};
`;

const InputField = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 10px;
  border: none;
  outline: none;
  padding: 0 12px;
  color: black;
  font-size: 20px;
  font-family: 'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  box-sizing: border-box;
`;

const SelectField = styled.select<{ $isPlaceholder?: boolean }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 10px;
  border: none;
  outline: none;
  padding: 0 12px;
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? '#6B6B6B' : 'black')};
  font-size: 20px;
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
  font-size: 20px;
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

const ThinDivider = styled.div`
  width: 100%;
  height: 0.5px;
  outline: 1px #BCBCBC solid;
  outline-offset: -0.25px;
`;

const FieldBox = styled.div`
  width: 311px;
  height: 37px;
  margin: 0 auto;
  background: #C2C2C2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
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

type ParameterType = 'int' | 'datetime' | 'float' | 'text' | 'bool';

/**
 * Страница настроек
 * Заглушечная страница для настроек приложения
 */
export const SettingsPage: React.FC = () => {
  const [parameterNameInput, setParameterNameInput] = useState<string>('');
  const [parameterTypeInput, setParameterTypeInput] = useState<'' | ParameterType>('');
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortById, setSortById] = useState<boolean>(false);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [pageInput, setPageInput] = useState<string>('');

  const nextId = useMemo(() => {
    if (parameters.length === 0) return 1;
    const maxId = parameters.reduce((max, p) => (p.id > max ? p.id : max), 0);
    return maxId + 1;
  }, [parameters]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(parameters.length / PAGE_SIZE)), [parameters]);

  // Загрузка параметров с сервера
  useEffect(() => {
    const loadParameters = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedParameters = await fetchParameters();
        setParameters(fetchedParameters);
      } catch (err) {
        console.error('SettingsPage: Failed to load parameters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load parameters');
      } finally {
        setLoading(false);
      }
    };

    loadParameters();
  }, []);

  useEffect(() => {
    // Clamp current page when total pages shrink due to deletions
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const sortedParameters = useMemo(() => {
    const arr = [...parameters];
    if (sortById) {
      arr.sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));
    }
    return arr;
  }, [parameters, sortById, sortAsc]);

  const handleToggleSortById = () => {
    setSortById(true);
    setSortAsc(prev => !prev);
  };

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(totalPages, Math.floor(page)));
    setCurrentPage(p);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const num = Number(pageInput);
      if (Number.isFinite(num) && num >= 1) {
        goToPage(num);
        setPageInput('');
      }
    }
  };

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

  const handleAddParameter = async () => {
    const trimmed = parameterNameInput.trim();
    
    if (!trimmed || parameterTypeInput === '') {
      alert('Пожалуйста, заполните имя параметра и выберите тип');
      return;
    }
    
    try {
      const request: CreateParameterRequest = {
        name: trimmed,
        type: parameterTypeInput,
      };
      
      const response = await createParameter(request, parameters);
      console.log('Parameter created with ID:', response.id);
      
      const newParameter: Parameter = {
        id: response.id,
        name: trimmed,
        type: parameterTypeInput,
      };
      
      setParameters(prev => [...prev, newParameter]);
      setParameterNameInput('');
      setParameterTypeInput('');
      
      // Optionally jump to last page to see the newly added row
      const newTotalPages = Math.max(1, Math.ceil((parameters.length + 1) / PAGE_SIZE));
      setCurrentPage(newTotalPages);
    } catch (err) {
      console.error('Failed to create parameter:', err);
      alert(`Ошибка при создании параметра: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleRemoveParameter = async (id: number) => {
    const target = parameters.find((p) => p.id === id);
    const nameLabel = target ? `${target.name} (${target.type})` : String(id);
    const ok = window.confirm(`Точно удалить параметр ${nameLabel}?`);
    if (!ok) return;

    // Сразу удаляем из UI для мгновенного отклика
    setParameters(prev => prev.filter(p => p.id !== id));

    try {
      await deleteParameter(id, parameters);
      console.log('Parameter deleted:', id);
    } catch (err) {
      console.error('Failed to delete parameter:', err);
      // Если ошибка, возвращаем параметр обратно
      setParameters(prev => [...prev, target!]);
      alert(`Ошибка при удалении параметра: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  if (loading) {
    return (
      <SettingsContainer>
        <Header />
        <PageHeader title="Настройка параметров" />
        <SettingsContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            fontSize: '18px',
            color: '#666666'
          }}>
            Загрузка параметров...
          </div>
        </SettingsContent>
      </SettingsContainer>
    );
  }

  if (error) {
    return (
      <SettingsContainer>
        <Header />
        <PageHeader title="Настройка параметров" />
        <SettingsContent>
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
        </SettingsContent>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <Header />
      <PageHeader title="Настройка параметров" />
      <SettingsContent>
        <TableWrapper>
          <TableHeader>
            <ClickableHeaderCell onClick={handleToggleSortById} aria-label="Сортировать по ID" title="Сортировать по ID">
              ID
            </ClickableHeaderCell>
            <HeaderCell>Параметр</HeaderCell>
            <HeaderCell>Тип</HeaderCell>
            <HeaderCell>Изменить</HeaderCell>
          </TableHeader>
          <Divider />
          <TableRow>
            <CellText>{nextId}</CellText>
            <FieldBox>
              <InputField
                placeholder="Введите имя параметра"
                value={parameterNameInput}
                onChange={(e) => setParameterNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddParameter();
                  }
                }}
                aria-label="Имя параметра"
              />
            </FieldBox>
            <FieldBox>
              <SelectField
                value={parameterTypeInput}
                onChange={(e) => setParameterTypeInput(e.target.value as '' | ParameterType)}
                aria-label="Тип параметра"
                $isPlaceholder={parameterTypeInput === ''}
              >
                <option value="" disabled>Выберите тип</option>
                <option value="int">int</option>
                <option value="datetime">datetime</option>
                <option value="float">float</option>
                <option value="text">text</option>
                <option value="bool">bool</option>
              </SelectField>
            </FieldBox>
            <PlusButton onClick={handleAddParameter} aria-label="Добавить параметр">
              <img src={plusIcon} alt="Добавить" width={34} height={34} />
            </PlusButton>
          </TableRow>
          {sortedParameters
            .slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE)
            .map((row, idx, arr) => (
            <React.Fragment key={row.id}>
              <ThinDivider />
              <TableRow $roundedBottom={idx === arr.length - 1}>
                <CellText>{row.id}</CellText>
                <CellText>{row.name}</CellText>
                <CellText>{row.type}</CellText>
                <IconButton onClick={() => handleRemoveParameter(row.id)} aria-label={`Удалить параметр ${row.name}`}>
                  <img src={minusIcon} alt="Удалить" width={34} height={34} />
                </IconButton>
              </TableRow>
            </React.Fragment>
          ))}
        </TableWrapper>
        {parameters.length > PAGE_SIZE && (
          <PaginationBar>
            <ArrowButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Предыдущая страница">
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
                  onKeyDown={handlePageInputKeyDown}
                  aria-label="Перейти на страницу"
                />
              </PageInputBox>
            </CenterPagination>

            <ArrowButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Следующая страница">
              <img src={arrightIcon} alt="Вперед" />
            </ArrowButton>
          </PaginationBar>
        )}
      </SettingsContent>
    </SettingsContainer>
  );
};
