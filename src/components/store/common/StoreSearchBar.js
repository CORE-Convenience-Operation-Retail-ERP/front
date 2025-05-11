import { useState } from 'react';
import {
  SearchWrap,
  Input,
  CriteriaSelect,
  ValueSelect,
  Button
} from '../../../features/store/styles/common/StoreSearchBar.styled';
import CustomCalendar from './CustomCalendar';

function StoreSearchBar({ filterOptions, onSearch }) {
  const [criteria, setCriteria] = useState(filterOptions[0]?.key || '');
  const [value, setValue] = useState('');
  const [range, setRange] = useState([null, null]);

  const selectedOption = filterOptions.find(opt => opt.key === criteria);
  const handleSelectChange = e => {
    const v = e.target.value;
    setValue(v);
    onSearch({ [criteria]: v });
  };
  const handleSearch = () => {
    if (!criteria) return;

    if (selectedOption.type === 'date-range') {
      const [start, end] = range;
      if (start && end) {
        onSearch({
          startDate: start.toISOString().split('T')[0],
          endDate:   end.toISOString().split('T')[0],
        });
      }
      return;
    }
    if (!value) return;
    onSearch({ [criteria]: selectedOption.type === 'number' ? Number(value) : value });
  };

  return (
    <SearchWrap>
      <CriteriaSelect
        value={criteria}
        onChange={e => { setCriteria(e.target.value); setValue(''); setRange([null, null]); }}
      >
        {filterOptions.map(opt => (
          <option key={opt.key} value={opt.key}>{opt.label}</option>
        ))}
      </CriteriaSelect>
      {selectedOption.type === 'tree' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* 대분류 */}
          <ValueSelect
            value={selectedOption.filters.parentCategoryId}
            onChange={e => selectedOption.onParentChange(e.target.value)}
          >
            <option value="">대분류</option>
            {selectedOption.parentCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </ValueSelect>

          {/* 중분류 */}
          <ValueSelect
            value={selectedOption.filters.categoryId}
            onChange={e => selectedOption.onChildChange(e.target.value)}
          >
            <option value="">중분류</option>
            {selectedOption.childCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </ValueSelect>

          {/* 소분류 */}
          <ValueSelect
            value={selectedOption.filters.subCategoryId}
            onChange={e => selectedOption.onSubChildChange(e.target.value)}
          >
            <option value="">소분류</option>
            {selectedOption.grandChildCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </ValueSelect>
        </div>
           )}
      {selectedOption.type === 'number' && (
       <Input
         type="number"
         value={value}
         onChange={e => setValue(e.target.value)}
         onKeyDown={e => {
          if (e.key === 'Enter') handleSearch();
        }}
       />
     )}

      {selectedOption.type === 'text' && (
        <Input value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter') handleSearch();
        }} />
      )}

      {selectedOption.type === 'select' && (
        <ValueSelect
        value={value}
        onChange={handleSelectChange}
      >
        {selectedOption.options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </ValueSelect>
      )}

      {selectedOption.type === 'date' && (
        <CustomCalendar
          selected={value ? new Date(value) : null}
          onChange={date => setValue(date.toISOString().split('T')[0])}
          placeholder="날짜 선택"
        />
      )}

{selectedOption.type === 'date-range' && (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <CustomCalendar
      selected={range[0]}
      onChange={date => setRange([date, range[1]])}
      placeholder="시작일 선택"
    />
    <span>~</span>
    
    <CustomCalendar
      selected={range[1]}
      onChange={date => setRange([range[0], date])}
      placeholder="종료일 선택"
    />
  </div>
)}

      <Button onClick={handleSearch}>검색</Button>
    </SearchWrap>
  );
}

export default StoreSearchBar;
