import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 80px;
  background-color: #f9fafb;
  position: relative;
`;

export const Logo = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #0A1F44;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const LogoutButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;
`;

export const IconWrap = styled.div`
  position: relative;
  cursor: pointer;
`;

export const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
`;

export const TotalText = styled.span`
  color: #6b7280;
  font-size: 14px;
`;