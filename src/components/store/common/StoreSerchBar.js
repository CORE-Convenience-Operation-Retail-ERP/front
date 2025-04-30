import { useState } from 'react';
import {
    SearchWrap,
    Input,
    CriteriaSelect,
    ValueSelect,
    Button
} from '../../../features/store/styles/common/StoreSearchBar.styled';

function StoreSearchBar({ onSearch }) {
    const [criteria, setCriteria] = useState('partName');
    const [value, setValue] = useState('');

    const handleSearch = () => {
        const searchParams = {
            partName: criteria === 'partName' ? value : null,
            position: criteria === 'position' ? value : null,
            partStatus: criteria === 'partStatus' && value !== '' ? Number(value) : null
        };
        onSearch(searchParams);
    };

    return (
        <SearchWrap>
            <CriteriaSelect value={criteria} onChange={(e) => {
                setCriteria(e.target.value);
                setValue('');
            }}>
                <option value="partName">이름</option>
                <option value="position">직책</option>
                <option value="partStatus">상태</option>
            </CriteriaSelect>

            {criteria === 'partStatus' ? (
                <ValueSelect value={value} onChange={(e) => setValue(e.target.value)}>
                    <option value="">전체</option>
                    <option value="1">재직</option>
                    <option value="0">퇴사</option>
                </ValueSelect>
            ) : (
                <Input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            )}

            <Button onClick={handleSearch}>검색</Button>
        </SearchWrap>
    );
}

export default StoreSearchBar;
