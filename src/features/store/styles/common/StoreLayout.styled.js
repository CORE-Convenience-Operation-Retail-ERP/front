import styled from "styled-components";

export const LayoutWrap = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px); /* 헤더 높이 빼기 */
`;

export const MainArea = styled.main`
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #fff;
`;