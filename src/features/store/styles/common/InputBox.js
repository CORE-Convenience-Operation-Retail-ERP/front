import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  min-width: 180px;

  &:focus {
    border-color: #4f46e5;
    outline: none;
  }

  &:disabled {
    background-color: #f4f4f4;
    color: #999;
    cursor: not-allowed;
  }
`;

function InputBox({
                      label,
                      value,
                      onChange,
                      id,
                      type = "text",
                      placeholder = "",
                      disabled = false,
                      ...rest
                  }) {
    return (
        <Wrapper>
            {label && <Label htmlFor={id}>{label}</Label>}
            <StyledInput
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                {...rest}
            />
        </Wrapper>
    );
}

export default InputBox;
