import styled from 'styled-components';
 
export const Sidebar = styled.aside`
  width: 240px;
  height: 100vh;
  background-color: #f9fafb;
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
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 16px;
  
  &:hover {
    color: #3B6FAE;
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

export const SubmenuItem = styled.div`
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;

  &:hover {
    background-color: #e0e7ff;
    color: #3B6FAE;
  }
`;

export const SidebarFooter = styled.div`
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
`;

export const FooterLine = styled.div`
  margin-top: 0.5rem;
`;