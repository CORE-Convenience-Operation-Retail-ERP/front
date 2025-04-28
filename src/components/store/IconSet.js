import { FiMail, FiBell, FiLogOut } from "react-icons/fi";
import styled from "styled-components";

const IconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

export const MailIcon = (props) => (
    <IconWrapper>
        <FiMail {...props} />
    </IconWrapper>
);

export const BellIcon = (props) => (
    <IconWrapper>
        <FiBell {...props} />
    </IconWrapper>
);

export const LogoutIcon = (props) => (
    <IconWrapper>
        <FiLogOut {...props} />
    </IconWrapper>
);
