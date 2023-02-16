import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { showBundle } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import BundleActions from "./bundle_actions";
import BundleDetails from "./bundle_details";

interface ShowBundleProps {
    backend: BackendApi;
}

export default function ShowBundle(props: ShowBundleProps) {
    const { t } = useTranslation('bundles');
    const bundle = useSelector((state: RootState) => state.bundles.showBundle);
    const dispatch = useDispatch();
    
    return (<>
        <Typography variant="h5" mb={2}>
            <Typography variant="h6" mb={2} component="span">
                <FontAwesomeIcon icon={faArrowLeft} style={{ cursor: 'pointer' }} onClick={() => dispatch(showBundle(undefined))} />
            </Typography>
            &nbsp;
            {t('title_show_bundle')}
            &nbsp;
            <b>{bundle?.name}</b>
            &nbsp;
            (#{bundle?.id})
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
                <BundleDetails bundle={bundle!} currency={props.backend.usd2} decimals={props.backend.usd2Decimals} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BundleActions bundle={bundle!} />
            </Grid>
        </Grid>
    </>);
}