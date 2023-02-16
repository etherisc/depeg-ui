import { Box, Button, Grid } from "@mui/material";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatAddress } from "../../utils/address";
import { formatDateTimeUtc } from "../../utils/date";
import { formatCurrencyBN } from "../../utils/numbers";

interface BundleActionsProps {
    bundle: BundleData;
}

export default function BundleActions(props: BundleActionsProps) {
    const { t } = useTranslation('bundles');

    // enum BundleState {
    //     Active,
    //     Locked,
    //     Closed,
    //     Burned
    // }

    const state = props.bundle.state;
    const isLockAllowed = state === 0;
    const isUnlockAllowed = state === 1;
    const isFundAllowed = state === 0 || state === 1;
    const isWithdrawAllowed = state !== 3;
    const isCloseAllowed = state === 0 || state === 1;
    const isBurnAllowed = state === 2;

    
    return (<Grid container spacing={2} data-testid="bundle-actions">
        {isFundAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.fund')}</Button>
        </Grid>}
        { isWithdrawAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.withdraw')}</Button>
        </Grid>}
        { isLockAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.lock')}</Button>
        </Grid>}
        { isUnlockAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.unlock')}</Button>
        </Grid>}
        { isCloseAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.close')}</Button>
        </Grid>}
        { isBurnAllowed && <Grid item xs={12}>
            <Button variant="contained" sx={{ minWidth: '12rem' }}>{t('action.burn')}</Button>
        </Grid>}
    </Grid>);
}


