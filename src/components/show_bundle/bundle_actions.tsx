import { Alert, Button, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import dayjs from "dayjs";
import { BigNumber } from "ethers";

interface BundleActionsProps {
    bundle: BundleData;
    connectedWallet: string;
    activeBundles: number;
    maxActiveBundles: number;
    actions: {
        fund: (bundle: BundleData) => Promise<boolean>,
        withdraw: (bundle: BundleData) => Promise<boolean>,
        extend: (bundle: BundleData) => Promise<boolean>,
        lock: (bundle: BundleData) => Promise<boolean>,
        unlock: (bundle: BundleData) => Promise<boolean>,
        close: (bundle: BundleData) => Promise<boolean>,
        burn: (bundle: BundleData) => Promise<boolean>,
    }
}

export default function BundleActions(props: BundleActionsProps) {
    const { t } = useTranslation('bundles');

    const isOwner = props.connectedWallet !== undefined && props.connectedWallet === props.bundle.owner;
    
    if (!isOwner) {
        return (<Alert severity="info">{t('alert.actions_only_owner')}</Alert>);
    }

    const extensionDaysBeforeEnd = parseInt(process.env.NEXT_PUBLIC_DEPEG_LIFETIME_EXTENSION_DAYS_BEFORE_END || "31");
    const bundleExpirationDate = dayjs.unix(props.bundle.createdAt).add(BigNumber.from(props.bundle.lifetime).toNumber(), 's');

    const state = props.bundle.state;
    const isLockAllowed = isOwner && (state === 0);
    const isUnlockAllowed = isOwner 
        && (state === 1) 
        && (props.activeBundles < props.maxActiveBundles);
    const isExtendAllowed = isOwner 
        && (state === 0) 
        && (bundleExpirationDate.diff(dayjs(), 'days') <= extensionDaysBeforeEnd);
    const isFundAllowed = isOwner && (state === 0 || state === 1);
    const isWithdrawAllowed = isOwner && (state !== 3);
    const isCloseAllowed = isOwner && (state === 0 || state === 1) && props.bundle.policies == 0;
    const isBurnAllowed = isOwner && (state === 2);

    async function fund() {
        await props.actions.fund(props.bundle);
    }

    async function withdraw() {
        await props.actions.withdraw(props.bundle);
    }

    async function extend() {
        await props.actions.extend(props.bundle);
    }

    async function lock() {
        await props.actions.lock(props.bundle);
    }

    async function unlock() {
        await props.actions.unlock(props.bundle);
    }

    async function close() {
        await props.actions.close(props.bundle);
    }

    async function burn() {
        await props.actions.burn(props.bundle);
    }

    
    return (<Grid container spacing={2} data-testid="bundle-actions">
        <Grid item xs={12}>
            <Button 
                onClick={fund}
                variant="contained" 
                disabled={!isFundAllowed}
                data-testid="button-fund"
                sx={{ minWidth: '12rem' }}
                >{t('action.fund')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={withdraw}
                variant="contained" 
                disabled={!isWithdrawAllowed}
                data-testid="button-withdraw"
                sx={{ minWidth: '12rem' }}
                >{t('action.withdraw')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={extend}
                variant="contained" 
                disabled={!isExtendAllowed}
                data-testid="button-extend"
                sx={{ minWidth: '12rem' }}
                >{t('action.extend')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={lock}
                variant="contained" 
                disabled={!isLockAllowed}
                data-testid="button-lock"
                sx={{ minWidth: '12rem' }}
                >{t('action.lock')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={unlock}
                variant="contained" 
                disabled={!isUnlockAllowed}
                data-testid="button-unlock"
                sx={{ minWidth: '12rem' }}
                >{t('action.unlock')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={close}
                variant="contained" 
                disabled={!isCloseAllowed}
                data-testid="button-close"
                sx={{ minWidth: '12rem' }}
                >{t('action.close')}</Button>
        </Grid>
        <Grid item xs={12}>
            <Button 
                onClick={burn}
                variant="contained" 
                disabled={!isBurnAllowed}
                data-testid="button-burn"
                sx={{ minWidth: '12rem' }}
                >{t('action.burn')}</Button>
        </Grid>
    </Grid>);
}

