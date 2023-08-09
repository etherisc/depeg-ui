import { faArrowLeft, faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertTitle, Button, Grid, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { BundleData } from "../../backend/bundle_data";
import useNotifications from "../../hooks/notifications";
import useTransactionNotifications from "../../hooks/trx_notifications";
import { showBundle, showBundleExtend, showBundleFund, showBundleWithdraw } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { TransactionFailedError } from "../../utils/error";
import { ga_event } from "../../utils/google_analytics";
import BundleActions from "./bundle_actions";
import BundleDetails from "./bundle_details";
import BundleExtendForm from "./bundle_extend_form";
import BundleFundForm from "./bundle_fund_form";
import BundleWithdrawForm from "./bundle_withdraw_form";

interface ShowBundleProps {
    backend: BackendApi;
}

export default function ShowBundle(props: ShowBundleProps) {
    const { t } = useTranslation('bundles');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { showPersistentErrorSnackbarWithCopyDetails } = useNotifications();
    const dispatch = useDispatch();

    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const bundle = useSelector((state: RootState) => state.bundles.showBundle);
    const connectedWalletAddress = useSelector((state: RootState) => state.account.address);
    const isShowBundleWithdraw = useSelector((state: RootState) => state.bundles.isShowBundleWithdraw);
    const isShowBundleFund = useSelector((state: RootState) => state.bundles.isShowBundleFund);
    const isShowBundleExtend = useSelector((state: RootState) => state.bundles.isShowBundleExtend);
    const maxActiveBundles = useSelector((state: RootState) => state.bundles.maxActiveBundles);
    const walletAddress = useSelector((state: RootState) => state.account.address);
    const showCreationConfirmation = useSelector((state: RootState) => state.bundles.showCreationConfirmation);
    
    const bundleManagementProps = props.backend.bundleManagement;
    const minLifetime = bundleManagementProps.minLifetime;
    const maxLifetime = bundleManagementProps.maxLifetime;
    
    useTransactionNotifications();

    async function fund(bundle: BundleData): Promise<boolean> {
        ga_event("bundle_fund", { category: 'navigation' });
        dispatch(showBundleFund(true));
        return Promise.resolve(true);   
    }

    async function withdraw(bundle: BundleData): Promise<boolean> {
        ga_event("bundle_defund", { category: 'navigation' });
        dispatch(showBundleWithdraw(true));
        return Promise.resolve(true);
    }

    async function extend(bundle: BundleData): Promise<boolean> {
        ga_event("bundle_extend", { category: 'navigation' });
        dispatch(showBundleExtend(true));
        return Promise.resolve(true);
    }

    async function withdrawAmount(bundleId: number, amount: BigNumber): Promise<boolean> {
        ga_event("trx_start_unstake", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.withdrawBundle(bundleId, amount);
            showSuccessNotification(t('withdraw_successful'));
            ga_event("trx_success_unstake", { category: 'chain_trx' });
            return r;
        } catch(e) {
            ga_event("trx_fail_unstake", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "withdraw");
                return false;
            } else {
                throw e;
            }
        } finally {
            dispatch(showBundleWithdraw(false));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function fundBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
        ga_event("trx_start_stake_add", { category: 'chain_trx' });
        try {
            await props.backend.createTreasuryApproval(walletAddress!, amount);
            ga_event("trx_success_stake_add_approval", { category: 'chain_trx' });
        } catch(e) {
            ga_event("trx_fail_stake_add_approval", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "fund_approval");
                return false;
            } else {
                throw e;
            }
        }
        
        try {
            const r = await props.backend.bundleManagement.fundBundle(bundleId, amount);
            ga_event("trx_success_stake_add", { category: 'chain_trx' });
            showSuccessNotification(t('fund_successful'));
            return r;
        } catch(e) {
            ga_event("trx_fail_stake_add", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "fund");
                return false;
            } else {
                throw e;
            }
        } finally {
            dispatch(showBundleWithdraw(false));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function extendBundle(bundleId: number, extensionDuration: number): Promise<boolean> {
        ga_event("trx_start_extend", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.extendBundle(bundleId, extensionDuration);
            ga_event("trx_success_lock", { category: 'chain_trx' });
            showSuccessNotification(t('extend_successful'));
            return r;
        } catch(e) {
            ga_event("trx_fail_extend", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "extend");
                return false;
            } else {
                throw e;
            }
        } finally {
            dispatch(showBundleExtend(false));
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function lock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        ga_event("trx_start_lock", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.lockBundle(bundleId);
            ga_event("trx_success_lock", { category: 'chain_trx' });
            showSuccessNotification(t('lock_successful'));
            return r;
        } catch(e) {
            ga_event("trx_fail_lock", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "lock");
                return false;
            } else {
                throw e;
            }
        } finally {
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function unlock(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        ga_event("trx_start_unlock", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.unlockBundle(bundleId);
            ga_event("trx_success_unlock", { category: 'chain_trx' });
            showSuccessNotification(t('unlock_successful'));
            return r;
        } catch(e) { 
            ga_event("trx_fail_unlock", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, 'unlock');
                return false;
            } else {
                throw e;
            }
        } finally {
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function close(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        ga_event("trx_start_close", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.closeBundle(bundleId);
            ga_event("trx_success_close", { category: 'chain_trx' });
            showSuccessNotification(t('close_successful'));
            return r;
        } catch(e) { 
            ga_event("trx_fail_close", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "close");
                return false;
            } else {
                throw e;
            }
        } finally {
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    async function burn(bundle: BundleData): Promise<boolean> {
        const bundleId = bundle.id;
        ga_event("trx_start_burn", { category: 'chain_trx' });
        try {
            const r = await props.backend.bundleManagement.burnBundle(bundleId);
            ga_event("trx_success_burn", { category: 'chain_trx' });
            showSuccessNotification(t('burn_successful'));
            return r;
        } catch(e) { 
            ga_event("trx_fail_burn", { category: 'chain_trx' });
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                showTrxFailedNotification(e, "burn");
                return false;
            } else {
                throw e;
            }
        } finally {
            await props.backend.triggerBundleUpdate(bundleId, dispatch);
        }
    }

    function showTrxFailedNotification(e: TransactionFailedError, action: string) {
        showPersistentErrorSnackbarWithCopyDetails(
            t('error.transaction_failed', { ns: 'common', error: e.code }),
            e.reason,
            action,
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

    async function getRemainingCapacity() {
        const riskpoolRemainingCapacityBN = await props.backend.bundleManagement.riskpoolRemainingCapacity();
        return parseInt(formatUnits(riskpoolRemainingCapacityBN, props.backend.usd2Decimals));
    }

    async function getBundleCapitalCap() {
        return await props.backend.bundleManagement.getBundleCapitalCap();
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
                { showCreationConfirmation && 
                    <Alert 
                        severity="success" 
                        variant="filled" 
                        sx={{ mb: 2 }}
                        icon={<FontAwesomeIcon icon={faCircleDollarToSlot} fontSize="4rem" />}
                        >
                        <AlertTitle>{t('confirmation.alert.title')}</AlertTitle>
                        {t('confirmation.alert.text')}
                    </Alert>
                }
                <BundleDetails bundle={bundle!} 
                    currency={props.backend.usd2} decimals={props.backend.usd2Decimals} 
                    currencyProtected={props.backend.usd1} decimalsProtected={props.backend.usd1Decimals} />
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
                        extend,
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
                        doCancel={() => dispatch(showBundleWithdraw(false))}
                        />
                }
                { isShowBundleFund && <BundleFundForm 
                        bundle={bundle!} 
                        maxStakedAmount={props.backend.bundleManagement.maxStakedAmount}
                        getRemainingRiskpoolCapacity={getRemainingCapacity}
                        getBundleCapitalCap={getBundleCapitalCap}
                        currency={props.backend.usd2} 
                        decimals={props.backend.usd2Decimals} 
                        doFund={fundBundle}
                        doCancel={() => dispatch(showBundleFund(false))}
                        />
                }
                { isShowBundleExtend && <BundleExtendForm 
                        bundle={bundle!} 
                        minLifetime={minLifetime}
                        maxLifetime={maxLifetime}
                        doExtend={extendBundle}
                        doCancel={() => dispatch(showBundleExtend(false))}
                        />
                }
            </Grid>
        </Grid>
    </>);
}