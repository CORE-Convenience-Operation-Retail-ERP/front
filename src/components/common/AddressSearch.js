import React from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AddressSearch = ({ onSelect, value, onChange }) => {
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 도로명 주소 또는 지번 주소
                const address = data.addressType === 'R' ? data.roadAddress : data.jibunAddress;
                
                // 선택한 주소 정보를 상위 컴포넌트로 전달
                onSelect({
                    zipCode: data.zonecode,
                    address: address,
                    roadAddress: data.roadAddress,
                    jibunAddress: data.jibunAddress,
                    detailAddress: '',
                    extraAddress: data.buildingName ? `(${data.buildingName})` : ''
                });

                // 주소 입력 필드 업데이트
                onChange({ 
                    target: { 
                        name: 'address', 
                        value: address 
                    } 
                });
            },
            width: '100%',
            height: '100%',
            animation: true,
            autoClose: true
        }).open();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    label="주소"
                    name="address"
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddressSearch}
                    startIcon={<SearchIcon />}
                    sx={{ minWidth: '120px' }}
                >
                    주소 검색
                </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
                주소를 검색하여 선택해주세요.
            </Typography>
        </Box>
    );
};

export default AddressSearch; 