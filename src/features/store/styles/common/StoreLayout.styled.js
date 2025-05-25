import styled from "styled-components";

export const LayoutWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: calc(100vh - 60px); 
  overflow: hidden;
`;

export const MainArea = styled.main`
  flex-grow: 1;
  min-width: 0;              
  overflow-x: auto;          
  overflow-y: auto;
  padding: 24px;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;