import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const StoreCard = styled.div`
  display: flex;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? '#6FC3ED' : 'transparent'};
  background-color: ${props => props.selected ? '#EDFCFF' : 'white'};
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
`;

const StoreAddress = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 10px;
  &:focus {
    outline: none;
    border-color: #6FC3ED;
    box-shadow: 0 0 0 2px rgba(76, 129, 175, 0.2);
  }
`;

const NextButton = styled.button`
  background-color: #6FC3ED;
  color: white;
  border: none;
  padding: 12px 20px;
  width: 100%;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #6FC3ED;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StoreSelectorCom = ({ onStoreSelect, onNext }) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        console.log('매장 목록 API 호출 시작');
        
        // 백엔드 서버 URL을 명시적으로 지정하고 withCredentials 옵션 추가
        const response = await axios.get('http://localhost:8080/api/customer/inquiry/test-stores', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true // 쿠키와 인증 정보 전송
        });
        
        console.log('매장 목록 API 응답:', response.data);
        setStores(response.data || []);
        setFilteredStores(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        // 오류 발생 시 빈 배열로 처리하여 앱이 계속 동작하도록 함
        setStores([]);
        setFilteredStores([]);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter(store => 
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      store.storeAddr.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    onStoreSelect(store);
  };

  const handleNext = () => {
    if (selectedStore) {
      onNext();
    }
  };

  if (loading) {
    return <Container><Title>매장 목록을 불러오는 중...</Title></Container>;
  }

  return (
    <Container>
      <Title>매장을 선택해주세요</Title>
      
      <SearchInput
        type="text"
        placeholder="매장명 또는 주소로 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <StoreList>
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <StoreCard
              key={store.storeId}
              selected={selectedStore && selectedStore.storeId === store.storeId}
              onClick={() => handleStoreSelect(store)}
            >
              <StoreInfo>
                <StoreName>{store.storeName}</StoreName>
                <StoreAddress>{store.storeAddr}</StoreAddress>
              </StoreInfo>
            </StoreCard>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </StoreList>
      
      <NextButton onClick={handleNext} disabled={!selectedStore}>
        다음
      </NextButton>
    </Container>
  );
};

export default StoreSelectorCom; 