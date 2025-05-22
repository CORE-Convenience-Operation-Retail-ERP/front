import styled from 'styled-components';

export const Sidebar = styled.aside`
  width: 240px;
  height: 100vh;
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
    text-align: center;
    font-size: 18px;
    color: #9ca3af;
    padding: 1rem 0;
    cursor: pointer;
    overflow: hidden;
    height: 160px;
`;

export const FooterContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; 
    padding: 0 20px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 1;
    visibility: visible;
    transition: opacity 0.5s ease, visibility 0.5s ease;

    ${SidebarFooter}:hover & {
        opacity: 0;
        visibility: hidden;
    }
`;

export const FooterLine = styled.div`
    width: 80%;
    height: 1px;
    background-color: #e0e0e0;
`;

export const FooterDetail = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    opacity: 0;
    visibility: hidden;
    font-size: 14px;
    color: #1A237E;
    background-color: #f9fafb; 
    border-radius: 8px;
    padding: 16px 20px;
    text-align: center;
    line-height: 1.4;
    transition: opacity 0.5s ease, visibility 0.5s ease;

    ${SidebarFooter}:hover & {
        opacity: 1;
        visibility: visible;
    }
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