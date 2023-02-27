import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { BundleData } from "../../backend/bundle_data";
import useTransactionNotifications from "../../hooks/trx_notifications";
import bundles, { showBundle, updateBundle,showBundleWithdraw, showBundleFund } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { TransactionFailedError } from "../../utils/error";
import BundleActions from "./bundle_actions";
import BundleDetails from "./bundle_details";
import BundleFundForm from "./bundle_fund_form";
import BundleWithdrawForm from "./bundle_withdraw_form";

interface ShowBundleProps {
    backend: BackendApi;
}

export default function ShowBundle(props: ShowBundleProps) {
    const { t } = useTranslation('bundles');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const bundle = useSelector((state: RootState) => state.bundles.showBundle);
    const connectedWalletAddress = useSelector((state: RootState) => state.account.address);
    const isShowBundleWithdraw = useSelector((state: RootState) => state.bundles.isShowBundleWithdraw);
    const isShowBundleFund = useSelector((state: RootState) => state.bundles.isShowBundleFund);
    const maxActiveBundles = useSelector((state: RootState) => state.bundles.maxActiveBundles);
    const walletAddress = useSelector((state: RootState) => state.account.address);
    
    useTransactionNotifications();

    async function fund(bundle: BundleData): Promise<boolean> {
        dispatch(showBundleFund(true));
        return Promise.resolve(true);   
    }

    async function withdraw(bundle: BundleData): Promise<boolean> {
        dispatch(showBundleWithdraw(true));
        return Promise.resolve(true);
    }

    async function withdrawAmount(bundleId: number, amount: BigNumber): Promise<boolean> {
        try {
            return await props.backend.invest.withdrawBundle(bundleId, amount);
        } catch(e) {
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            dispatch(showBundleWithdraw(false));
            showSuccessNotification(t('withdraw_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function fundBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
        // FIXME: make approval use new notification mechanism
        try {
            await props.backend.createTreasuryApproval(walletAddress!, amount, () => {}, () => {});
        } catch(e) {
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        }
        
        try {
            return await props.backend.invest.fundBundle(bundleId, amount);
        } catch(e) {
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            dispatch(showBundleWithdraw(false));
            showSuccessNotification(t('fund_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function lock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        try {
            return await props.backend.invest.lockBundle(bundleId);
        } catch(e) {
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            showSuccessNotification(t('unlock_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function unlock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        try {
            return await props.backend.invest.unlockBundle(bundleId);
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            showSuccessNotification(t('unlock_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function close(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        try {
            return await props.backend.invest.closeBundle(bundleId);
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            showSuccessNotification(t('unlock_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function burn(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        try {
            return await props.backend.invest.burnBundle(bundleId);
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e);
                return false;
            } else {
                throw e;
            }
        } finally {
            showSuccessNotification(t('unlock_successful'));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    function showTrxFailedNotification(e: TransactionFailedError) {
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
    }

    function showSuccessNotification(text: string) {
        enqueueSnackbar(
            text,
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
                    activeBundles={bundles.filter(b => b.state === 0 /* ACTIVE */).length}
                    maxActiveBundles={maxActiveBundles}
                    actions={{
                        fund,
                        withdraw,
                        lock,
                        unlock,
                        close,
                        burn,
                    }}
                    />
                { isShowBundleWithdraw && <BundleWithdrawForm 
                        bundle={bundle!} 
                        currency={props.backend.usd2} 
                        decimals={props.backend.usd2Decimals} 
                        doWithdraw={withdrawAmount}
                        />
                }
                { isShowBundleFund && <BundleFundForm 
                        bundle={bundle!} 
                        currency={props.backend.usd2} 
                        decimals={props.backend.usd2Decimals} 
                        doFund={fundBundle}
                        />
                }
            </Grid>
        </Grid>
    </>);
}