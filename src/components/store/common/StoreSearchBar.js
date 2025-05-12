import { useState } from 'react';
import {
  SearchWrap,
  Input,
  CriteriaSelect,
  ValueSelect,
  Button
} from '../../../features/store/styles/common/StoreSearchBar.styled';
import CustomCalendar from './CustomCalendar';

function StoreSearchBar({ filterOptions = [], onSearch }) {
  const [criteria, setCriteria] = useState(filterOptions[0]?.key || '');
  const [value, setValue] = useState('');
  const [range, setRange] = useState([null, null]);

  const selectedOption = filterOptions.find(opt => opt.key === criteria) || {};

  const handleSelectChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onSearch({ [criteria]: v });
  };

  const getAllCategoryIds = async () => {
    const {
      parentCategoryId,
      categoryId,
      subCategoryId,
    } = selectedOption.filters || {};

    let selected = subCategoryId || categoryId || parentCategoryId;
    if (!selected) return [];

    try {
      const res = await fetch(`/api/categories/all-descendants/${selected}`);
      const ids = await res.json();
      return ids;
    } catch (e) {
      console.error("하위 카테고리 조회 실패", e);
      return [selected]; // fallback
    }
  };

  const handleSearch = async () => {
    if (!criteria) return;

    if (selectedOption.type === 'tree') {
      const categoryIds = await getAllCategoryIds();
      onSearch({ categoryIds });
      return;
    }

    if (selectedOption.type === 'date-range') {
      const [start, end] = range;
      if (start && end) {
        onSearch({
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
        });
      }
      return;
    }

    if (!value) return;
    const formattedValue = selectedOption.type === 'number' ? Number(value) : value;
    onSearch({ [criteria]: formattedValue });
  };

  const renderSelectOptions = (options = [], defaultLabel = "선택") => (
    <>
      <option value="">{defaultLabel}</option>
      {options.map(o => (
        <option key={o.id || o.value} value={o.id || o.value}>
          {o.name || o.label}
        </option>
      ))}
    </>
  );

  return (
    <SearchWrap>
      <CriteriaSelect
        value={criteria}
        onChange={(e) => {
          setCriteria(e.target.value);
          setValue('');
          setRange([null, null]);
        }}
      >
        {filterOptions.map(opt => (
          <option key={opt.key} value={opt.key}>{opt.label}</option>
        ))}
      </CriteriaSelect>

      {selectedOption.type === 'tree' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ValueSelect
            value={selectedOption.filters?.parentCategoryId || ''}
            onChange={(e) => selectedOption.onParentChange?.(e.target.value)}
          >
            {renderSelectOptions(selectedOption.parentCategories, "대분류")}
          </ValueSelect>

          <ValueSelect
            value={selectedOption.filters?.categoryId || ''}
            onChange={(e) => selectedOption.onChildChange?.(e.target.value)}
          >
            {renderSelectOptions(selectedOption.childCategories, "중분류")}
          </ValueSelect>

          <ValueSelect
            value={selectedOption.filters?.subCategoryId || ''}
            onChange={(e) => selectedOption.onSubChildChange?.(e.target.value)}
          >
            {renderSelectOptions(selectedOption.grandChildCategories, "소분류")}
          </ValueSelect>
        </div>
      )}

      {selectedOption.type === 'number' && (
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      )}

      {selectedOption.type === 'text' && (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      )}

      {selectedOption.type === 'select' && (
        <ValueSelect value={value} onChange={handleSelectChange}>
          {renderSelectOptions(selectedOption.options)}
        </ValueSelect>
      )}

      {selectedOption.type === 'date' && (
        <CustomCalendar
          selected={value ? new Date(value) : null}
          onChange={(date) => setValue(date.toISOString().split('T')[0])}
          placeholder="날짜 선택"
        />
      )}

      {selectedOption.type === 'date-range' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <CustomCalendar
            selected={range[0]}
            onChange={(date) => setRange([date, range[1]])}
            placeholder="시작일"
          />
          <span>~</span>
          <CustomCalendar
            selected={range[1]}
            onChange={(date) => setRange([range[0], date])}
            placeholder="종료일"
          />
        </div>
      )}

      <Button onClick={handleSearch}>검색</Button>
    </SearchWrap>
  );
}

export default StoreSearchBar;