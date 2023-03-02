import { useMediaQuery, useTheme } from "@mui/material";
import { BackendApi } from "../../backend/backend_api";
import BundlesListDesktop from "./bundles_list_desktop";
import BundlesListMobile from "./bundles_list_mobile";

export interface BundlesProps {
    backend: BackendApi;
}

export default function BundlesList(props: BundlesProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    if (isMobile) {
        return (<BundlesListMobile backend={props.backend} />);
    } else {
        return (<BundlesListDesktop backend={props.backend} />);
    }
}