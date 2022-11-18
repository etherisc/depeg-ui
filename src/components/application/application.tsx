import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppActionType, AppContext } from "../../context/app_context";
import { useTranslation } from 'next-i18next';
import { InsuranceApi } from "../../model/insurance_api";
import { useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import ApplicationForm from "./application_form";
import { Signer, VoidSigner } from "ethers";
import { useRouter } from 'next/router'

export interface ApplicationProps {
    insurance: InsuranceApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

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
    const [ premiumTrxText, setPremiumTrxText ] = useState(undefined);

    async function walletDisconnected() {
        setWalletAddress("");
    }

    // get bundle data once the wallet is connected
    useEffect(() => {
        async function asyncGetBundles(dispatch: any) {
            const bundles = await props.insurance.getRiskBundles();
            bundles.forEach((bundle) => dispatch({ type: AppActionType.ADD_BUNDLE, bundle: bundle}))
            dispatch({ type: AppActionType.BUNDLE_LOADING_FINISHED });
            setPremiumTrxText(undefined);
        }

        console.log("signer", appContext.data.signer, "bundleDataInitialized", appContext.data.bundlesInitialized);
        if (appContext.data.signer !== undefined && ! appContext.data.bundlesInitialized && ! (appContext.data.signer instanceof VoidSigner)) {
            appContext.dispatch({ type: AppActionType.BUNDLE_INITIALIZING });
            setPremiumTrxText(t('bundle_loading'));
            console.log("got a new signer ... getting bundles");
            asyncGetBundles(appContext.dispatch);
        }    
    }, [appContext, props.insurance])
    
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
        // redirect to policy list (/)
        router.push("/");
    }

    async function doApproval(walletAddress: string, premium: number): Promise<Boolean> {
        let snackbarId = enqueueSnackbar(
            t('approval_info'),
            { variant: "warning", persist: true }
        );
        let snackbarId2;
        try {
            return await props.insurance.createApproval(walletAddress, premium, () => {
                snackbarId2 = enqueueSnackbar(
                    t('approval_wait'),
                    { variant: "info", persist: true }
                );
            });
            // FIXME: handle error during approval
        } finally {
            closeSnackbar(snackbarId);
            if (snackbarId2 !== undefined) {
                closeSnackbar(snackbarId2);
            }
        }
    }

    async function doApplication(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number): Promise<boolean> {
        const snackbarId = enqueueSnackbar(
            t('apply_info'),
            { variant: "warning", persist: true }
        );
        let snackbarId2;
        try {
            return await props.insurance.applyForPolicy(walletAddress, insuredAmount, coverageDuration, premium, () => {
                snackbarId2 = enqueueSnackbar(
                    t('apply_wait'),
                    { variant: "info", persist: true }
                );
            });
            // FIXME: handle error during apply for policy
        } finally {
            closeSnackbar(snackbarId);
            if (snackbarId2 !== undefined) {
                closeSnackbar(snackbarId2);
            }
        }
    }

    async function applyForPolicy(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number): Promise<boolean> {
        setActiveStep(3);
        const approvalSuccess = await doApproval(walletAddress, premium);
        setActiveStep(4);
        const applicationSuccess = await doApplication(walletAddress, insuredAmount, coverageDuration, premium);
        setActiveStep(5);
        applicationSuccessful();
        return Promise.resolve(applicationSuccess);        
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
                    insurance={props.insurance}
                    bundles={appContext.data.bundles}
                    formReadyForApply={formReadyForApply}
                    applyForPolicy={applyForPolicy}
                    premiumTrxText={premiumTrxText}
                />
            </div>
        </>
    );
}