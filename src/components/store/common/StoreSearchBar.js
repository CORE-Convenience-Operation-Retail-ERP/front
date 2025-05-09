import { useState } from 'react';
import {
  SearchWrap,
  Input,
  CriteriaSelect,
  ValueSelect,
  Button
} from '../../../features/store/styles/common/StoreSearchBar.styled';

function StoreSearchBar({ filterOptions, onSearch }) {
  const [criteria, setCriteria] = useState(filterOptions[0]?.key || '');
  const [value, setValue] = useState('');

  const selectedOption = filterOptions.find(opt => opt.key === criteria);

  const handleSearch = () => {
    const searchParams = {
      [criteria]: selectedOption.type === 'number' ? Number(value) : value
    };
    onSearch(searchParams);
  };

  return (
    <SearchWrap>
      {/* 검색 기준 드롭다운 */}
      <CriteriaSelect
        value={criteria}
        onChange={(e) => {
          setCriteria(e.target.value);
          setValue('');
        }}
      >
        {filterOptions.map(opt => (
          <option key={opt.key} value={opt.key}>{opt.label}</option>
        ))}
      </CriteriaSelect>

      {/* 검색 입력 방식 결정 */}
      {selectedOption.type === 'select' ? (
        <ValueSelect value={value} onChange={(e) => setValue(e.target.value)}>
          {selectedOption.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </ValueSelect>
      ) : (
        <Input
          type={selectedOption.type || 'text'}
          placeholder={selectedOption.placeholder || '검색어 입력'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      )}

      <Button onClick={handleSearch}>검색</Button>
    </SearchWrap>
  );
}

export default StoreSearchBar;
