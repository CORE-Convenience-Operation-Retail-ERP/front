import styled, { css } from 'styled-components';

const baseButton = css`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
`;

export const PrimaryButton = styled.button`
    ${baseButton}
    background-color: #3b82f6;
    color: white;

    &:hover {
        background-color: #2563eb;
    }

    &:disabled {
        background-color: #d1d5db;
        cursor: not-allowed;
    }
`;

export const DangerButton = styled(PrimaryButton)`
    background-color: #ef4444;

    &:hover {
        background-color: #dc2626;
    }
`;

export const OutlineButton = styled(PrimaryButton)`
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const SmallButton = styled(PrimaryButton)`
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
`;

export const FullWidthButton = styled(PrimaryButton)`
  display: block;
  width: 100%;
  text-align: center;
`;

export const IconButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  svg {
    font-size: 16px;
  }
`;

export const ViewToggleButton = styled.button`
  ${baseButton}
  background-color: ${({ selected }) => (selected ? "#3b82f6" : "#f3f4f6")};
  color: ${({ selected }) => (selected ? "white" : "#6b7280")};
  border: none;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#2563eb" : "#e5e7eb")};
  }
`;


export const WhiteButton = styled(PrimaryButton)`
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background-color: #f9fafb;
  }
`;