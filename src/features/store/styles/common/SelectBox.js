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

const SelectWrapper = styled.div`
    position: relative;
    width: 120px;
`;

const RightArrow = styled.span`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #666;
    font-size: 12px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 10px 8px 30px; 
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

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
                       placeholder = "선택",
                       disabled = false,
                   }) {
    return (
        <Wrapper>
            {label && <Label htmlFor={id}>{label}</Label>}
            <SelectWrapper>
                <RightArrow>▼</RightArrow>
                <StyledSelect id={id} value={value} onChange={onChange} disabled={disabled}>
                    <option value="" disabled hidden style={{ textAlign: "center" }}>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ textAlign: "left" }}>
                            {opt.label}
                        </option>
                    ))}
                </StyledSelect>
            </SelectWrapper>
        </Wrapper>
    );
}


export default SelectBox;