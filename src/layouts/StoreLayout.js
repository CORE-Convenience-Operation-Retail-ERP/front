import StoreHeaderCon from "../container/store/common/StoreHeaderCon";
import StoreSidebarCon from "../container/store/common/StoreSidebarCon";
import { Outlet } from 'react-router-dom';

function StoreLayout () {
    return(
        <>
        <StoreHeaderCon/>
        <StoreSidebarCon/>
        <Outlet/>
        </>
    )
}
export default StoreLayout;