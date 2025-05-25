import styled, {css, keyframes} from 'styled-components';

export const Sidebar = styled.aside`
  width: 240px;
  height: 94vh;
  background-color: #dcebff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 1rem;
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuButton = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #699adb;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    font-size: 16px;
    transition: color 0.3s ease;

    ${({ isActive }) =>
            isActive &&
            `
    color: #314663;
  `}

    &:hover {
        color: #314663;
    }
`;

export const Submenu = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isOpen'
})`
    margin-left: 1.5rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0px)' : 'translateY(-10px)')};
    max-height: ${({ isOpen }) => (isOpen ? '500px' : '0px')};
    overflow: hidden;
    transition: all 0.3s ease;
`;

export const SubmenuItem = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isActive'
})`
    color: ${({ isActive }) => (isActive ? '#314663' : '#314663')};
    font-size: 14px;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    background-color: ${({ isActive }) => (isActive ? '#b5d4fe' : 'transparent')};
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #b5d4fe;
        color: #3B6FAE;
    }
`;

export const SidebarFooter = styled.div`
    position: relative;
    padding: 12px;
    text-align: center;
`;

const spinY = keyframes`
    from { transform: rotateY(0deg); }
    to   { transform: rotateY(360deg); }
`;

export const FooterContent = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-size: ${({size}) => size || 14}px;
    user-select: none;

    ${({spinning}) =>
            spinning &&
            css`
      animation: ${spinY} 0.5s ease;
    `}
`;

export const FooterDetail = styled.div`
    position: absolute;
    bottom: 80px; 
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    height: 150px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.6;
    color: #374151;
    padding: 12px;
    z-index: 999;
    align-content: center;
    animation: riseUp 0.25s ease-out;

    &::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
    }

    @keyframes riseUp {
        from {
            transform: translate(-50%, 10px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }

    ${({ open }) =>
            !open &&
            css`
                display: none;
            `}
`;



export const MenuIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    transition: color 0.3s ease;

    svg {
        font-size: 18px; // 사이즈 조정
    }
`;

