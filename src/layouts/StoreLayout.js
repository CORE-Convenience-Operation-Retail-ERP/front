import StoreHeaderCon from "../containers/store/common/StoreHeaderCon";
import StoreSidebarCon from "../containers/store/common/StoreSidebarCon";
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