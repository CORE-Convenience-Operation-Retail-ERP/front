import styled from 'styled-components';
import { FiMail, FiBell, FiLogOut } from "react-icons/fi";

// 공통 아이콘 스타일
const iconCommonStyle = `
  font-size: 22px;
  color: #9ca3af;
  transition: color 0.3s ease;
`;

// MailIcon
export const MailIcon = styled(FiMail)`
    ${iconCommonStyle}

    ${props => props.$hovered && `
    color: #ffffff;
  `}
`;

// BellIcon
export const BellIcon = styled(FiBell)`
    ${iconCommonStyle}

    ${props => props.$hovered && `
    color: #facc15;
  `}
`;

// LogoutIcon
export const LogoutIcon = styled(FiLogOut)`
    font-size: 22px;
    color: ${({ $hovered }) => ($hovered ? '#fb7185' : '#9ca3af')};
    transition: color 0.3s ease;
`;
