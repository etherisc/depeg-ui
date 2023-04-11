import { Alert, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import { SnackbarKey, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import useNotifications from "../../hooks/notifications";
import useTransactionNotifications from "../../hooks/trx_notifications";
import { RootState } from "../../redux/store";
import { ApprovalFailedError, TransactionFailedError } from "../../utils/error";
import { ga_event } from "../../utils/google_analytics";
import { REVOKE_INFO_URL } from "../application/application";
import StakingForm from "./staking_form";
import { ComponentState } from "../../types/component_state";

export interface StakeProps {
    backend: BackendApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

export default function Stake(props: StakeProps) {
    const { t } = useTranslation(['stake', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const dispatch = useDispatch();
    useTransactionNotifications();
    const { showPersistentErrorSnackbarWithCopyDetails } = useNotifications();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const investorAddress = useSelector((state: RootState) => state.account.address);
    const [ riskpookComponentActive, setRiskpoolComponentActive ] = useState(true);
    const [ isInvestorWhitelisted, setIsInvestorWhitelisted ] = useState(true);
    const [ riskpoolCapacityAvailable, setNoRiskpoolCapacityAvailable ] = useState(true);
    const [ maxBundlesUsed, setMaxBundlesUsed ] = useState(false);
    const [ activeStep, setActiveStep ] = useState(isConnected ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ readyToStake, setReadyToStake ] = useState(false);

    useEffect(() => {
        async function checkStakingAllowed() {
            if (isConnected && investorAddress !== undefined) {
                const riskpoolComponentState = await props.backend.bundleManagement.getRiskpoolComponentState();
                if (riskpoolComponentState !== ComponentState.Active) {
                    setRiskpoolComponentActive(false);
                    return;
                }
                if (! await props.backend.bundleManagement.isAllowAllAccountsEnabled()) {
                    const isInvestorWhitelisted = await props.backend.bundleManagement.isInvestorWhitelisted(investorAddress!);
                    console.log("whitelist check result", isInvestorWhitelisted);
                    if (! isInvestorWhitelisted) {
                        setIsInvestorWhitelisted(false);
                        return;
                    } else {
                        setIsInvestorWhitelisted(true);
                    }
                }
                const riskpoolCapacityAvailable = await props.backend.bundleManagement.isRiskpoolCapacityAvailable();
                console.log("riskpoolCapacityAvailable", riskpoolCapacityAvailable);
                if (! riskpoolCapacityAvailable) {
                    setNoRiskpoolCapacityAvailable(false);
                    return;
                } else {
                    setNoRiskpoolCapacityAvailable(true);
                }
                const activeBundleCount = await props.backend.bundleManagement.activeBundles();
                const maxBundles = await props.backend.bundleManagement.maxBundles();
                console.log("activeBundleCount", activeBundleCount, "maxBundles", maxBundles);
                if (activeBundleCount >= maxBundles) {
                    setMaxBundlesUsed(true);
                } else {
                    setMaxBundlesUsed(false);
                }
            }    
        }
        checkStakingAllowed();
    }, [isConnected, props.backend.bundleManagement, investorAddress]);

            

    // change steps according to application state
    useEffect(() => {
        if (! isConnected) {
            setActiveStep(0);
        } else if (activeStep < 1 && isConnected) {
            setActiveStep(1);
        } else if (activeStep == 1 && readyToStake) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToStake) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [isConnected, activeStep, readyToStake]);

    useEffect(() => {
        if (activeStep < 1 || activeStep > 2) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [activeStep]);

    function formReadyForStake(isFormReady: boolean) {
        setReadyToStake(isFormReady);
    }

    async function applicationSuccessful(bundleId: number) {
        await props.backend.triggerBundleUpdate(bundleId, dispatch);
        router.push("/bundles?confirmation=true&&id=" + bundleId);
    }

    async function doApproval(walletAddress: string, stakedAmount: BigNumber): Promise<Boolean> {
        try {
            return await props.backend.createTreasuryApproval(
                walletAddress, 
                stakedAmount, 
            );
        } catch(e) { 
            if ( e instanceof ApprovalFailedError) {
                console.log("approval failed", e);
        
                showPersistentErrorSnackbarWithCopyDetails(
                    t('error.approval_failed', { ns: 'common', error: e.code }),
                    e.reason
                );
                return Promise.resolve(false);
            } else {
                throw e;
            }
        }
    }

    async function doStake(
        name: string, lifetime: number, investorWalletAddress: string, 
        stakedAmount: BigNumber, minProtectedAmount: BigNumber, maxProtectedAmount: BigNumber,
        minDuration: number, maxDuration: number, 
        annualPctReturn: number
    ): Promise<{ status: boolean, bundleId: string | undefined}> {
        let snackbar: SnackbarKey | undefined = undefined; 
        try {
            return await props.backend.bundleManagement.stake(
                name, 
                lifetime,
                investorWalletAddress, 
                stakedAmount, 
                minProtectedAmount,
                maxProtectedAmount,
                minDuration, 
                maxDuration, 
                annualPctReturn, 
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('stake_info', { address }),
                        { variant: "warning", persist: true }
                    );
                },
                (address: string) => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('stake_wait'),
                        { variant: "info", persist: true }
                    );
                });
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                if (snackbar !== undefined) {
                    closeSnackbar(snackbar);
                }

                showPersistentErrorSnackbarWithCopyDetails(
                    t('error.transaction_failed', { ns: 'common', error: e.code }),
                    e.reason
                );
                return { status: false, bundleId: undefined};
            } else {
                throw e;
            }
        } finally {
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }
        }
    }

    function showAllowanceNotice() {
        enqueueSnackbar(
            (<>
                {t('error.allowance_revoke_notice', { ns: 'common' })}&nbsp;
                <a href={REVOKE_INFO_URL} target="_blank" rel="noreferrer">here</a>
            </>),
            { 
                variant: "info", 
                persist: true,
                action: (key) => {
                    return (
                        <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                    );
                }
            }
        );
    }

    function enableUnloadWarning(enable: boolean) {
        if (enable) {
            window.onbeforeunload = function() {
                return t('warning.unload_page', { ns: 'common' });
            }
        } else {
            window.onbeforeunload = null;
        }
    }

    async function stake(
        name: string, lifetime: number, stakedAmount: BigNumber, 
        minProtectedAmount: BigNumber, maxProtectedAmount: BigNumber,
        minDuration: number, maxDuration: number, annualPctReturn: number
    ) {
        ga_event("trx_start_stake", { category: 'chain_trx' });
        try {
            enableUnloadWarning(true);
            const investorWalletAddress = await signer!.getAddress();
            if (! await checkBalance(investorWalletAddress, BigNumber.from(stakedAmount))) {
                enqueueSnackbar(
                    t('balance_insufficient', { currency: props.backend.usd2 }),
                    { variant: "error", autoHideDuration: 3000 }
                );
                return;
            }
            setActiveStep(3);
            const approvalSuccess = await doApproval(investorWalletAddress, stakedAmount);
            if ( ! approvalSuccess) {
                ga_event("trx_fail_stake_approve", { category: 'chain_trx' });
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            ga_event("trx_success_stake_approve", { category: 'chain_trx' });
            setActiveStep(4);
            const stakeResult = await doStake(name, lifetime, investorWalletAddress, stakedAmount, minProtectedAmount, maxProtectedAmount, minDuration, maxDuration, annualPctReturn);
            if ( ! stakeResult.status) {
                ga_event("trx_fail_stake", { category: 'chain_trx' });
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            ga_event("trx_success_stake", { category: 'chain_trx' });
            setActiveStep(5);
            await applicationSuccessful(parseInt(stakeResult.bundleId as string));
        } finally {
            enableUnloadWarning(false);
        }
    }

    return (
        <>
            <div>
                <Typography variant="h5" mb={2}>{t('title', { currency: props.backend.usd2 })}</Typography>

                <Stepper activeStep={activeStep} sx={{ display: { 'xs': 'none', 'md': 'flex' }}}>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{t(label)}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                { ! riskpookComponentActive && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.riskpool_deactivated')}</Alert>)}
                { ! isInvestorWhitelisted && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.investor_not_whitelisted')}</Alert>)}
                { ! riskpoolCapacityAvailable && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.no_riskpool_capacity')}</Alert>)}
                { maxBundlesUsed && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.max_bundles')}</Alert>)}

                <StakingForm
                        formDisabled={formDisabled || maxBundlesUsed || ! isInvestorWhitelisted || ! riskpoolCapacityAvailable || ! riskpookComponentActive}
                        usd2={props.backend.usd2}
                        usd2Decimals={props.backend.usd2Decimals}
                        backend={props.backend}
                        readyToSubmit={formReadyForStake}
                        hasUsd2Balance={(walletAddress, amount) => props.backend.hasUsd2Balance(walletAddress, amount)}
                        stake={stake}
                    />
            </div>
        </>
    );

    async function checkBalance(walletAddress: string, amount: BigNumber): Promise<boolean> {
        return await props.backend.hasUsd2Balance(walletAddress, amount);
    }
}