import { useState } from 'react';
import {
    SearchWrap,
    Input,
    Select,
    Button
} from '../../../features/store/styles/common/StoreSearchBar.styled';

function StoreSearchBar({ onSearch }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const handleSearch = () => {
        onSearch(name, status || null); // status가 ''이면 null로 처리
    };

    return (
        <SearchWrap>
            <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">전체</option>
                <option value="1">재직</option>
                <option value="0">퇴사</option>
            </Select>
            <Button onClick={handleSearch}>검색</Button>
        </SearchWrap>
    );
}

export default StoreSearchBar;
