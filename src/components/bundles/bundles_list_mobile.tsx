import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { BundleData } from "../../backend/bundle_data";
import { addBundle, finishLoading, reset, setMaxActiveBundles, showBundle, startLoading } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { formatDateUtc } from "../../utils/date";
import { ga_event } from "../../utils/google_analytics";

export interface BundlesProps {
    backend: BackendApi;
}

export default function BundlesListMobile(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const theme = useTheme();
    const dispatch = useDispatch();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const address = useSelector((state: RootState) => state.account.address);
    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const isLoadingBundles = useSelector((state: RootState) => state.bundles.isLoadingBundles);

    const bundleManagementApi = props.backend.bundleManagement;
    
    useEffect(() => {
        async function getBundles() {
            dispatch(startLoading());
            dispatch(reset());
            
            if (address === undefined ) {
                dispatch(finishLoading());
                return;
            }
    
            await bundleManagementApi.fetchAllBundles((bundle: BundleData) => dispatch(addBundle(bundle)) );
            const maxActiveBundles = await bundleManagementApi.maxBundles();
            const activeBundles = await bundleManagementApi.activeBundles();
            dispatch(setMaxActiveBundles(maxActiveBundles));
            dispatch(finishLoading());
        }
        getBundles();
    }, [signer, bundleManagementApi, address, dispatch]); // update bundles when signer changes


    function renderListItemTitle(bundle: BundleData) {
        const lifetime = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 'seconds').unix();
        return (
            <>
                {bundle.id} | {bundle.name} 
                <br/> 
                {t('table.header.apr')}: {bundle.apr}%, {t('table.header.lifetime')}: {formatDateUtc(lifetime)}
            </>
        );
    }

    function renderListIcon(bundle: BundleData) {
        if (bundle.owner === address) {
            return (<><FontAwesomeIcon icon={faUser} /></>)
        }
        return (<></>);
    }

    const loadingBar = isLoadingBundles ? <LinearProgress /> : null;

    // clone array so it can be sorted (sort is inplace and props are readonly)
    const bundlesToShow = [] as BundleData[];
    bundles.forEach((bundle: BundleData) => bundlesToShow.push(bundle));
    bundlesToShow.sort((a, b) => a.apr - b.apr);

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <List>
                {bundlesToShow.map((bundle: BundleData) => (
                    <ListItem disablePadding key={bundle.id}>
                        <ListItemButton onClick={() => {
                            ga_event("bundle_details", { category: 'navigation' });
                            dispatch(showBundle(bundle));
                        }}>
                            <ListItemIcon>
                                {renderListIcon(bundle)}
                            </ListItemIcon>
                            <ListItemText primary={renderListItemTitle(bundle)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
}