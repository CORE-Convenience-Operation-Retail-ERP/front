import styled, { css } from "styled-components";

export const ChartWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 0.25rem;

  &:hover {
    opacity: 0.9;
  }
`;

export const ColorCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: ${({ color }) => color || "#ccc"};

  ${({ active }) =>
    active &&
    css`
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
      transform: scale(1.1);
    `}
`;

export const PickerContainer = styled.div`
  margin-top: 1rem;
`;
