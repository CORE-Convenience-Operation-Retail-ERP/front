import styled from 'styled-components';

export const CardContainer = styled.div`
  border: ${(props) => (props.isSaved ? '1.5px solid gold' : '1px solid #e0e0e0')};
  background-color: ${(props) =>
    props.isSelected ? '#e6f0ff' : '#fafafa'};
  border-radius: 12px;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: ${(props) =>
    props.isSaved
      ? '0 0 6px rgba(255, 215, 0, 0.4)'
      : '0 1px 3px rgba(0,0,0,0.1)'};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
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
