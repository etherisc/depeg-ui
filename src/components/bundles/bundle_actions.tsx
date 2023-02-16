import { Button, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";

interface BundleActionsProps {
    bundle: BundleData;
    actions: {
        fund: (bundle: BundleData) => Promise<boolean>,
        withdraw: (bundle: BundleData) => Promise<boolean>,
        lock: (bundle: BundleData) => Promise<boolean>,
        unlock: (bundle: BundleData) => Promise<boolean>,
        close: (bundle: BundleData) => Promise<boolean>,
        burn: (bundle: BundleData) => Promise<boolean>,
    }
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

    async function fund() {
        // TODO: implement this
        await props.actions.fund(props.bundle);
    }

    async function withdraw() {
        // TODO: implement this
        await props.actions.withdraw(props.bundle);
    }

    async function lock() {
        // TODO: implement this
        await props.actions.lock(props.bundle);
    }

    async function unlock() {
        // TODO: implement this
        await props.actions.unlock(props.bundle);
    }

    async function close() {
        // TODO: implement this
        await props.actions.close(props.bundle);
    }

    async function burn() {
        // TODO: implement this
        await props.actions.burn(props.bundle);
    }

    
    return (<Grid container spacing={2} data-testid="bundle-actions">
        {isFundAllowed && <Grid item xs={12}>
            <Button 
                onClick={fund}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.fund')}</Button>
        </Grid>}
        { isWithdrawAllowed && <Grid item xs={12}>
            <Button 
                onClick={withdraw}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.withdraw')}</Button>
        </Grid>}
        { isLockAllowed && <Grid item xs={12}>
            <Button 
                onClick={lock}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.lock')}</Button>
        </Grid>}
        { isUnlockAllowed && <Grid item xs={12}>
            <Button 
                onClick={unlock}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.unlock')}</Button>
        </Grid>}
        { isCloseAllowed && <Grid item xs={12}>
            <Button 
                onClick={close}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.close')}</Button>
        </Grid>}
        { isBurnAllowed && <Grid item xs={12}>
            <Button 
                onClick={burn}
                variant="contained" 
                sx={{ minWidth: '12rem' }}
                >{t('action.burn')}</Button>
        </Grid>}
    </Grid>);
}


