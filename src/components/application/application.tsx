import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppActionType, AppContext } from "../../context/app_context";
import { useTranslation } from 'next-i18next';
import { InsuranceApi } from "../../backend/insurance_api";
import { SnackbarKey, useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import { Signer, VoidSigner } from "ethers";
import { useRouter } from 'next/router'
import { formatCurrency } from "../../utils/numbers";
import ApplicationForm from "./application_form";
import { ApprovalFailedError, TransactionFailedError } from "../../utils/error";

export interface ApplicationProps {
    insurance: InsuranceApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];
export const REVOKE_INFO_URL = "https://metamask.zendesk.com/hc/en-us/articles/4446106184731-How-to-revoke-smart-contract-allowances-token-approvals";

export default function Application(props: ApplicationProps) {
    const { t } = useTranslation(['application', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    const appContext = useContext(AppContext);
    const [ activeStep, setActiveStep ] = useState(appContext.data.signer === undefined ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ walletAddress, setWalletAddress ] = useState("");
    const [ readyToBuy, setReadyToBuy ] = useState(false);
    // const [ premiumTrxInProgress, setPremiumTrxInProgress ] = useState(false);
    const [ premiumTrxTextKey, setPremiumTrxTextKey ] = useState("");

    async function walletDisconnected() {
        setWalletAddress("");
    }

    // get bundle data once the wallet is connected
    useEffect(() => {
        async function asyncGetBundles(dispatch: any) {
            const bundles = await props.insurance.application.getRiskBundles();
            bundles.forEach((bundle) => dispatch({ type: AppActionType.ADD_BUNDLE, bundle: bundle}))
            dispatch({ type: AppActionType.BUNDLE_LOADING_FINISHED });
            setPremiumTrxTextKey("");
        }

        console.log("signer", appContext.data.signer, "bundleDataInitialized", appContext.data.bundlesInitialized);
        if (appContext.data.signer !== undefined && ! appContext.data.bundlesInitialized && ! (appContext.data.signer instanceof VoidSigner)) {
            appContext.dispatch({ type: AppActionType.BUNDLE_INITIALIZING });
            setPremiumTrxTextKey('bundle_loading');
            console.log("got a new signer ... getting bundles");
            asyncGetBundles(appContext.dispatch);
        }    
    }, [appContext, props.insurance, t]);
    
    // change steps according to application state
    useEffect(() => {
        if (appContext?.data.signer === undefined) {
            setActiveStep(0);
            walletDisconnected();
        } else if (activeStep < 1 && appContext.data.signer !== undefined) {
            setActiveStep(1);
            updateWalletAddress(appContext.data.signer);
        } else if (activeStep == 1 && readyToBuy) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToBuy) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [appContext?.data.signer, activeStep, readyToBuy]);

    useEffect(() => {
        if (activeStep < 1 || activeStep > 2) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [activeStep]);

    function formReadyForApply(isFormReady: boolean) {
        setReadyToBuy(isFormReady);
    }

    function applicationSuccessful() {
        enqueueSnackbar(
            t('application_success'),
            { 
                variant: 'success', 
                autoHideDuration: 5000, 
                preventDuplicate: true,
            }
        );
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        // redirect to policy list
        router.push("/policies");
    }

    async function doApproval(walletAddress: string, premium: number): Promise<Boolean> {
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.insurance.createTreasuryApproval(
                walletAddress, 
                premium, 
                (address, currency, amount) => {
                    snackbar = enqueueSnackbar(
                        t('approval_info', { address, currency, amount: formatCurrency(amount, props.insurance.usd1Decimals) }),
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
                }
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

    async function doApplication(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number): Promise<boolean> {
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.insurance.application.applyForPolicy(
                walletAddress, 
                insuredAmount, 
                coverageDuration, 
                premium, 
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('apply_info', { address }),
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

    async function applyForPolicy(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number) {
        setActiveStep(3);
        const approvalSuccess = await doApproval(walletAddress, premium);
        if ( ! approvalSuccess) {
            setActiveStep(2);
            showAllowanceNotice();
            return;
        }
        setActiveStep(4);
        const applicationSuccess = await doApplication(walletAddress, insuredAmount, coverageDuration, premium);
        if ( ! applicationSuccess) {
            setActiveStep(2);
            showAllowanceNotice();
            return;
        }
        setActiveStep(5);
        applicationSuccessful();
    }

    async function updateWalletAddress(signer: Signer) {
        setWalletAddress(await signer.getAddress());
    }

    if (appContext.data.signer !== undefined) {
        updateWalletAddress(appContext.data.signer);
    }

    return (
        <>
            <div>
                <Typography variant="h5" mb={2}>{t('title', { currency: props.insurance.usd1 })}</Typography>

                <Stepper activeStep={activeStep}>
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

                <ApplicationForm 
                    disabled={formDisabled}
                    walletAddress={walletAddress}
                    usd1={props.insurance.usd1}
                    usd1Decimals={props.insurance.usd1Decimals}
                    usd2={props.insurance.usd2}
                    usd2Decimals={props.insurance.usd2Decimals}
                    applicationApi={props.insurance.application}
                    bundles={appContext.data.bundles}
                    formReadyForApply={formReadyForApply}
                    applyForPolicy={applyForPolicy}
                    premiumTrxTextKey={premiumTrxTextKey}
                />
            </div>
        </>
    );
}