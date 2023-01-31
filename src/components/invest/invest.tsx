import { Alert, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { BackendApi } from "../../backend/backend_api";
import { SnackbarKey, useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import InvestForm from "./invest_form";
import { useRouter } from "next/router";
import { formatCurrency, formatCurrencyBN } from "../../utils/numbers";
import { ApprovalFailedError, TransactionFailedError } from "../../utils/error";
import { REVOKE_INFO_URL } from "../application/application";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BundleConfirmation from "./bundle_confirmation";
import { BigNumber } from "ethers";
import { updateAccountBalance } from "../../utils/chain";

export interface InvestProps {
    insurance: BackendApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

export default function Invest(props: InvestProps) {
    const { t } = useTranslation(['invest', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const dispatch = useDispatch();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const [ maxBundlesUsed, setMaxBundlesUsed ] = useState(false);
    const [ activeStep, setActiveStep ] = useState(isConnected ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ readyToInvest, setReadyToInvest ] = useState(false);
    const [ investmentDetails, setInvestmentDetails ] = useState(["0", BigNumber.from(0), BigNumber.from(0), BigNumber.from(0), 0, 0, 0 ]);

    useEffect(() => {
        async function checkMaxBundles() {
            if (isConnected) {
                const bundleCount = await props.insurance.invest.bundleCount();
                const maxBundles = await props.insurance.invest.maxBundles();
                console.log("bundleCount", bundleCount, "maxBundles", maxBundles);
                if (bundleCount >= maxBundles) {
                    setMaxBundlesUsed(true);
                    setFormDisabled(true);
                } else {
                    setMaxBundlesUsed(false);
                    setFormDisabled(false);
                }
            }    
        }
        checkMaxBundles();
    }, [isConnected, props.insurance.invest]);

            

    // change steps according to application state
    useEffect(() => {
        if (! isConnected) {
            setActiveStep(0);
        } else if (activeStep < 1 && isConnected) {
            setActiveStep(1);
        } else if (activeStep == 1 && readyToInvest) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToInvest) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [isConnected, activeStep, readyToInvest]);

    useEffect(() => {
        if (activeStep < 1 || activeStep > 2) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [activeStep]);

    function formReadyForInvest(isFormReady: boolean) {
        setReadyToInvest(isFormReady);
    }

    function applicationSuccessful() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        updateAccountBalance(signer!, dispatch);
    }

    async function doApproval(walletAddress: string, investedAmount: BigNumber): Promise<Boolean> {
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.insurance.createTreasuryApproval(
                walletAddress, 
                investedAmount, 
                (address, currency, amount) => {
                    snackbar = enqueueSnackbar(
                        t('approval_info', { address, currency, amount: formatCurrencyBN(amount, props.insurance.usd2Decimals) }),
                        { variant: "warning", persist: true }
                    );
                },
                (address, currency, amount) => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('approval_wait'),
                        { variant: "info", persist: true }
                    );
                },
            );
        } catch(e) { 
            if ( e instanceof ApprovalFailedError) {
                console.log("approval failed", e);
                if (snackbar !== undefined) {
                    closeSnackbar(snackbar);
                }

                enqueueSnackbar(
                    t('error.approval_failed', { ns: 'common', error: e.code }),
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
                return Promise.resolve(false);
            } else {
                throw e;
            }
        } finally {
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }
        }
    }

    async function doInvest(
        name: string, lifetime: number, investorWalletAddress: string, 
        investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
        minDuration: number, maxDuration: number, 
        annualPctReturn: number
    ): Promise<{ status: boolean, bundleId: string | undefined}> {
        let snackbar: SnackbarKey | undefined = undefined; 
        try {
            return await props.insurance.invest.invest(
                name, 
                lifetime,
                investorWalletAddress, 
                investedAmount, 
                minSumInsured, 
                maxSumInsured, 
                minDuration, 
                maxDuration, 
                annualPctReturn, 
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('invest_info', { address }),
                        { variant: "warning", persist: true }
                    );
                },
                (address: string) => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('invest_wait'),
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

    async function invest(
        name: string, lifetime: number, investedAmount: BigNumber, 
        minSumInsured: BigNumber, maxSumInsured: BigNumber, 
        minDuration: number, maxDuration: number, annualPctReturn: number
    ) {
        try {
            enableUnloadWarning(true);
            const investorWalletAddress = await signer!.getAddress();
            if (! await checkBalance(investorWalletAddress, BigNumber.from(investedAmount))) {
                enqueueSnackbar(
                    t('balance_insufficient', { currency: props.insurance.usd2 }),
                    { variant: "error", autoHideDuration: 3000 }
                );
                return;
            }
            setActiveStep(3);
            const approvalSuccess = await doApproval(investorWalletAddress, investedAmount);
            if ( ! approvalSuccess) {
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            setActiveStep(4);
            const investResult = await doInvest(name, lifetime, investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
            if ( ! investResult.status) {
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            setActiveStep(5);
            applicationSuccessful();
            setInvestmentDetails([investResult.bundleId as string, BigNumber.from(investedAmount), 
                BigNumber.from(minSumInsured), BigNumber.from(maxSumInsured),
                minDuration, maxDuration,
                annualPctReturn]);
        } finally {
            enableUnloadWarning(false);
        }
    }

    let content;
    if (activeStep < 5) {
        content = (<InvestForm 
                        formDisabled={formDisabled}
                        usd2={props.insurance.usd2}
                        usd2Decimals={props.insurance.usd2Decimals}
                        insurance={props.insurance}
                        formReadyForInvest={formReadyForInvest}
                        invest={invest}
                    />)
    } else {
        content = (<BundleConfirmation
                        bundleId={investmentDetails[0] as string}
                        currency={props.insurance.usd2}
                        currencyDecimals={props.insurance.usd2Decimals}
                        investedAmount={investmentDetails[1] as BigNumber}
                        minSumInsured={investmentDetails[2] as BigNumber}
                        maxSumInsured={investmentDetails[3] as BigNumber}
                        minCoverage={investmentDetails[4] as number}
                        maxCoverage={investmentDetails[5] as number}
                        apr={investmentDetails[6] as number}
                        />);
    }

    return (
        <>
            <div>
                <Typography variant="h5" mb={2}>{t('title', { currency: props.insurance.usd2 })}</Typography>

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

                { maxBundlesUsed && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.max_bundles')}</Alert>)}

                {content}
            </div>
        </>
    );

    async function checkBalance(walletAddress: string, amount: BigNumber): Promise<boolean> {
        return await props.insurance.hasUsd2Balance(walletAddress, amount);
    }
}