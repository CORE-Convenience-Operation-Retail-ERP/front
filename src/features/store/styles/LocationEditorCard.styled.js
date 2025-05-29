import styled from 'styled-components';

export const CardContainer = styled.div`
  border-radius: 12px;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #d00;
  }
`;

export const DragHandle = styled.div`
  font-weight: 600;
  cursor: ${(props) => (props.draggable ? 'move' : 'default')};
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
`;

export const StyledInput = styled.input`
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
`;

export const StyledSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
`;
