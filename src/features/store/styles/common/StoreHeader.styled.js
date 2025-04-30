import styled from 'styled-components';
import { FiMail, FiBell, FiLogOut} from "react-icons/fi";
import { FaBuilding } from 'react-icons/fa';


// 공통 Wrapper (hover 배경색을 props로 받음!)

export const IconWrap = styled.div`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
    background-color: transparent;

    &:hover {
        background-color: ${({ hoverbg }) => hoverbg || '#dbeafe'}; /* 🔥 props로 hoverbg 받음 */
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        transform: scale(1.05);
    }
`;


export const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 30px;
    background: transparent;
    cursor: pointer;
    color: #9ca3af;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
        background-color: #ffe4e6;
        color: #fb7185;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        transform: scale(1.05);
    }
`;

// IconSet
export const MailIcon = styled(FiMail)`
    font-size: 22px;
    color: ${({ $hovered }) => ($hovered ? '#ffffff' : '#9ca3af')};
    transition: color 0.2s ease;
`;

export const BellIcon = styled(FiBell)`
    font-size: 22px;
    color: ${({ $hovered }) => ($hovered ? '#facc15' : '#9ca3af')};
    transition: color 0.2s ease;
`;

export const BuildingIcon = styled(FaBuilding)`
    font-size: 22px;
    color: ${({ $hovered }) => ($hovered ? '#8b5cf6' : '#9ca3af')};
    transition: color 0.2s ease;
`;

export const LogoutIcon = styled(FiLogOut)`
    font-size: 22px;
    color: ${({ $hovered }) => ($hovered ? '#fb7185' : '#9ca3af')};
    transition: color 0.2s ease;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 80px;
  background-color: #f9fafb;
  position: relative;
`;

export const LogoImage = styled.img`
  height: 40px;
  object-fit: contain;
  cursor: pointer;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;