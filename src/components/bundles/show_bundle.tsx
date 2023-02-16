import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { SnackbarKey, useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { BundleData } from "../../backend/bundle_data";
import { addBundle, showBundle, updateBundle } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { TransactionFailedError } from "../../utils/error";
import BundleActions from "./bundle_actions";
import BundleDetails from "./bundle_details";

interface ShowBundleProps {
    backend: BackendApi;
}

export default function ShowBundle(props: ShowBundleProps) {
    const { t } = useTranslation('bundles');
    const bundle = useSelector((state: RootState) => state.bundles.showBundle);
    const connectedWalletAddress = useSelector((state: RootState) => state.account.address);
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    async function fund(bundle: BundleData): Promise<boolean> {
        // TODO: implement fund
        return Promise.resolve(true);   
    }

    async function withdraw(bundle: BundleData): Promise<boolean> {
        // TODO: implement withdraw
        return Promise.resolve(true);
    }

    async function lock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.backend.invest.lockBundle(
                bundleId,
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('lock_info', { address }),
                        { variant: "warning", persist: true }
                    );
                },
                () => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('apply_wait'),
                        { variant: "info", persist: true }
                    );
                });
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                if (snackbar !== undefined) {
                    closeSnackbar(snackbar);
                }

                enqueueSnackbar(
                    t('error.transaction_failed', { ns: 'common', error: e.code }),
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (
                                <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                            );
                        }
                    }
                );
                return false;
            } else {
                throw e;
            }
        } finally {
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }

            enqueueSnackbar(
                t('lock_successful'),
                { 
                    variant: "success", 
                    persist: true,
                    action: (key) => {
                        return (
                            <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                        );
                    }
                }
            );

            const updatedBundle = await props.backend.triggerBundleUpdate(bundleId);
            dispatch(updateBundle(updatedBundle));
        }
    }

    async function unlock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.backend.invest.unlockBundle(
                bundleId,
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('unlock_info', { address }),
                        { variant: "warning", persist: true }
                    );
                },
                () => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('apply_wait'),
                        { variant: "info", persist: true }
                    );
                });
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                if (snackbar !== undefined) {
                    closeSnackbar(snackbar);
                }

                enqueueSnackbar(
                    t('error.transaction_failed', { ns: 'common', error: e.code }),
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (
                                <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                            );
                        }
                    }
                );
                return false;
            } else {
                throw e;
            }
        } finally {
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }

            enqueueSnackbar(
                t('unlock_successful'),
                { 
                    variant: "success", 
                    persist: true,
                    action: (key) => {
                        return (
                            <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                        );
                    }
                }
            );

            const updatedBundle = await props.backend.triggerBundleUpdate(bundleId);
            dispatch(updateBundle(updatedBundle));
        }
    }

    async function close(bundle: BundleData): Promise<boolean> {
        // TODO: implement close  
        return Promise.resolve(true);
    }

    async function burn(bundle: BundleData): Promise<boolean> {
        // TODO: implement burn
        return Promise.resolve(true);
    }
    
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
                <BundleActions 
                    bundle={bundle!} 
                    connectedWallet={connectedWalletAddress!}
                    actions={{
                        fund,
                        withdraw,
                        lock,
                        unlock,
                        close,
                        burn,
                    }}
                    />
            </Grid>
        </Grid>
    </>);
}