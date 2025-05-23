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
    background-color: #6b7280;  // slate-500

    &:hover {
        background-color: #4b5563;  // slate-600
    }

    &:disabled {
        background-color: #9ca3af;  // slate-400
        cursor: not-allowed;
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

export const IconButton = styled.button`
    ${baseButton}
    display: flex;
    align-items: center;
    gap: 6px;

    background-color: #f9fafb;           
    color: #1f2937;                       
    border: 1px solid #d1d5db;           

    &:hover {
        background-color: #3b82f6;          
        color: white;
        border-color: #3b82f6;

        svg {
            color: white;
        }
    }

    svg {
        font-size: 18px;
        color: #4b5563;                     
    }

    &:disabled {
        background-color: #f3f4f6;
        border-color: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;

        svg {
            color: #9ca3af;
        }
    }
`;

export const AttendanceButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  color: #1f2937;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #3b82f6;
    color: white;

    svg {
      color: white;
    }
  }

  svg {
    font-size: 18px;
    color: #4b5563;
  }
`;

export const IconOnlyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  svg {
    font-size: 18px;
    color: #374151;
  }

  &:hover {
    background-color: #3b82f6;

    svg {
      color: white;
    }
  }
`;