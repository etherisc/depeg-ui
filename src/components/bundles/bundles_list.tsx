import { useMediaQuery, useTheme } from "@mui/material";
import { BackendApi } from "../../backend/backend_api";
import BundlesListDesktop from "./bundles_list_desktop";
import BundlesListMobile from "./bundles_list_mobile";
import { useEffect } from "react";
import { BundleData } from "../../backend/bundle_data";
import { startLoading, finishLoading, addBundle, setMaxActiveBundles, reset } from "../../redux/slices/bundles";
import address from "../address";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export interface BundlesProps {
    backend: BackendApi;
}

export default function BundlesList(props: BundlesProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const bundleManagementApi = props.backend.bundleManagement;
    const signer = useSelector((state: RootState) => state.chain.signer);

    useEffect(() => {
        async function getBundles() {
            // TODO: remove
            // if (signer === undefined) {
            //     return;
            // }

            dispatch(startLoading());
            dispatch(reset());
            
            // TODO: remove
            if (address === undefined ) {
                dispatch(finishLoading());
                return;
            }
    
            await bundleManagementApi.fetchAllBundles((bundle: BundleData) => dispatch(addBundle(bundle)) );

            if (signer !== undefined) {
                const maxActiveBundles = await bundleManagementApi.maxBundles();
                dispatch(setMaxActiveBundles(maxActiveBundles));
            }
            
            dispatch(finishLoading());
        }
        getBundles();
    }, [signer, bundleManagementApi, dispatch]); // update bundles when signer changes


    if (isMobile) {
        return (<BundlesListMobile />);
    } else {
        return (<BundlesListDesktop usd2={props.backend.usd2} usd2Decimals={props.backend.usd2Decimals} />);
    }
}