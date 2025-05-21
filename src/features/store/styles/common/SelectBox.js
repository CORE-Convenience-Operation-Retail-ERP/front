import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 500;
  text-align: left;
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  width: 100px;
  min-width: 100px;
  text-align: center;
  &:focus {
    border-color: #4f46e5;
    outline: none;
  }
`;

function SelectBox({
                       label,
                       value,
                       onChange,
                       options = [],
                       id,
                       placeholder = "-- 선택 --",
                       disabled = false,
                   }) {
    return (
        <Wrapper>
            {label && <Label htmlFor={id}>{label}</Label>}
            <StyledSelect id={id} value={value} onChange={onChange} disabled={disabled}>
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </StyledSelect>
        </Wrapper>
    );
}

export default SelectBox;
