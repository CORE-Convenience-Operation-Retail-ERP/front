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

export const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#fff",
  fontSize: "14px",
  color: "#333",
  minWidth: "140px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  cursor: "pointer",
  outline: "none",
  transition: "border-color 0.2s ease",
};

export const buttonStyle = {
  padding: "6px 14px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#fff",
  color: "#333",
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  transition: "all 0.2s ease",
};

export const activeStyle = {
  backgroundColor: "#e6f0ff",
  borderColor: "#3399ff",
  color: "#007bff",
  fontWeight: "bold",
};
