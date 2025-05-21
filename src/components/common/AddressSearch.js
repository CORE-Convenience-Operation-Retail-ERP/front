import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddressSearch = ({ onSelect, value, onChange, detailAddress = '', onDetailAddressChange }) => {
    const [detail, setDetail] = useState(detailAddress);
    const [mainAddress, setMainAddress] = useState(value);

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 도로명 주소 또는 지번 주소
                const address = data.addressType === 'R' ? data.roadAddress : data.jibunAddress;
                
                // 메인 주소 상태 업데이트
                setMainAddress(address);
                
                // 선택한 주소 정보를 상위 컴포넌트로 전달
                onSelect({
                    zipCode: data.zonecode,
                    address: address,
                    roadAddress: data.roadAddress,
                    jibunAddress: data.jibunAddress,
                    detailAddress: detail,
                    extraAddress: data.buildingName ? `(${data.buildingName})` : '',
                    fullAddress: detail ? `${address} ${detail}` : address
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

    const handleDetailChange = (e) => {
        const newDetail = e.target.value;
        setDetail(newDetail);
        
        // 상세 주소가 변경될 때마다 상위 컴포넌트로 전달
        if (onDetailAddressChange) {
            onDetailAddressChange(newDetail);
        }
        
        // 메인 주소가 있는 경우, 전체 주소 업데이트
        if (mainAddress) {
            onSelect({
                address: mainAddress,
                detailAddress: newDetail,
                fullAddress: newDetail ? `${mainAddress} ${newDetail}` : mainAddress
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* 주소 검색 영역 */}
            <Box>
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    mb: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                }}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                        기본 주소
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 1 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="주소 검색 버튼을 클릭하여 주소를 검색해주세요"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <LocationOnIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                                ),
                            }}
                            name="address"
                            value={value}
                            onChange={onChange}
                            sx={{ 
                                '& .MuiInputBase-root': {
                                    height: 56,
                                    fontSize: '1.1rem'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddressSearch}
                            startIcon={<SearchIcon fontSize="small" />}
                            sx={{ 
                                minWidth: '90px', 
                                height: 56,
                                fontSize: '0.95rem',
                                borderRadius: 2
                            }}
                        >
                            검색
                        </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.9rem' }}>
                        실제 매장 위치의 도로명 주소나 지번 주소를 검색해주세요.
                    </Typography>
                </Paper>
            </Box>

            {/* 상세 주소 입력 영역 */}
            <Box>
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                }}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                        상세 주소
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="상세 주소를 입력해주세요 (동/호수/층 등)"
                        InputProps={{
                            startAdornment: (
                                <HomeIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                            ),
                        }}
                        name="detailAddress"
                        value={detail}
                        onChange={handleDetailChange}
                        sx={{ 
                            mt: 1,
                            '& .MuiInputBase-root': {
                                height: 56,
                                fontSize: '1.1rem'
                            }
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.9rem' }}>
                        건물명, 동호수, 층수 등 상세 주소를 정확히 입력하면 배송 및 방문에 도움이 됩니다.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default AddressSearch; 