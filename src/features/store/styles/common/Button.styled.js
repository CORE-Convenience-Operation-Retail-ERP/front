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
    background-color: #007eff;
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


export const IconButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  svg {
    font-size: 16px;
  }
`;



export const NavigationWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-right: 1rem;

    button {
        padding: 6px 12px;
        min-width: 50px;
        width: 70px;
        white-space: nowrap;
        font-size: 14px;
    }
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
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
