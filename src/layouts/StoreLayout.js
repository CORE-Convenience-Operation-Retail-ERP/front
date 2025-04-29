import StoreHeaderCon from "../containers/store/common/StoreHeaderCon";
import StoreSidebarCon from "../containers/store/common/StoreSidebarCon";
import { Outlet } from 'react-router-dom';
import { LayoutWrap, MainArea } from "../features/store/styles/common/StoreLayout.styled";

function StoreLayout() {
    return (
        <>
            <StoreHeaderCon />
            <LayoutWrap>
                <StoreSidebarCon />
                <MainArea>
                    <Outlet />
                </MainArea>
            </LayoutWrap>
        </>
    );
}

export default StoreLayout;
