import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { RootState } from "../../redux/store";
import BundleDetails from "./bundle_details";

interface ShowBundleProps {
    backend: BackendApi;
}

export default function ShowBundle(props: ShowBundleProps) {
    const { t } = useTranslation('bundles');
    const bundle = useSelector((state: RootState) => state.bundles.showBundle);
    return (<>
        <Typography variant="h5" mb={2}>{t('title_show_bundle')} <b>{bundle?.name}</b> (#{bundle?.id})</Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
                <BundleDetails bundle={bundle!} currency={props.backend.usd2} decimals={props.backend.usd2Decimals} />
            </Grid>
            <Grid item xs={12} md={6}>
                Actions
            </Grid>
        </Grid>
    </>);
}