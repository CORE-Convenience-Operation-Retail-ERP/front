import StoreHeaderCon from "../container/store/StoreHeaderCon";
import StoreSidebarCon from "../container/store/StoreSidebarCon";
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