import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../../../features/store/styles/common/Button.styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 16px;
  color: #111;
  margin-bottom: 4px;

  &::after {
    content: '*';
    color: red;
    margin-left: 4px;
  }
`;

const SubSection = styled.div`
  margin-left: 4px;
`;

const SubLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const AddressRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;

  &:read-only {
    background-color: #f9fafb;
    cursor: pointer;
  }
`;

const Hint = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  margin-left: 2px;
`;

const AddressSearchCustom = ({
  value,
  onChange,
  detailAddress = '',
  onDetailAddressChange,
  onSelect
}) => {
  const [mainAddress, setMainAddress] = useState(value || '');
  const [detail, setDetail] = useState(detailAddress || '');

  useEffect(() => {
    setMainAddress(value);
  }, [value]);

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const address = data.roadAddress || data.jibunAddress;
        setMainAddress(address);
        onSelect?.({
          zipCode: data.zonecode,
          address,
          detailAddress: detail,
          fullAddress: detail ? `${address} ${detail}` : address,
        });
        onChange?.({
          target: {
            name: 'address',
            value: address,
          },
        });
      },
    }).open();
  };

  const handleDetailChange = (e) => {
    const newDetail = e.target.value;
    setDetail(newDetail);
    onDetailAddressChange?.(newDetail);
    if (mainAddress) {
      onSelect?.({
        address: mainAddress,
        detailAddress: newDetail,
        fullAddress: newDetail ? `${mainAddress} ${newDetail}` : mainAddress,
      });
    }
  };

  return (
    <Container>
      <SubSection style={{marginTop:'5px'}}>
        <SubLabel>기본 주소</SubLabel>
        <AddressRow>
          <Input
            name="address"
            value={mainAddress}
            readOnly
            onClick={handleAddressSearch}
            placeholder="주소 검색 버튼을 클릭해주세요"
          />
          <PrimaryButton type="button" onClick={handleAddressSearch}>
            검색
          </PrimaryButton>
        </AddressRow>
        <Hint>도로명 또는 지번 주소를 검색해 주세요.</Hint>
      </SubSection>

      <SubSection>
        <SubLabel>상세 주소</SubLabel>
        <Input
          name="detailAddress"
          value={detail}
          onChange={handleDetailChange}
          placeholder="건물, 동호수, 층수 등"
        />
        <Hint>상세 주소를 입력해주세요.</Hint>
      </SubSection>
    </Container>
  );
};

export default AddressSearchCustom;
