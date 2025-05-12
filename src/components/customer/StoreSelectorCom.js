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
  border: 2px solid ${props => props.selected ? '#4CAF50' : 'transparent'};
  background-color: ${props => props.selected ? '#f1f8e9' : 'white'};
  
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
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const NextButton = styled.button`
  background-color: #4CAF50;
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
    background-color: #45a049;
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
        const response = await axios.get('/api/stores');
        setStores(response.data);
        setFilteredStores(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
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