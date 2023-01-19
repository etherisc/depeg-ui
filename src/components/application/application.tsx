import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { InsuranceApi } from "../../backend/insurance_api";
import { SnackbarKey, useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import { BigNumber, Signer, VoidSigner } from "ethers";
import { formatCurrency } from "../../utils/numbers";
import ApplicationForm from "./application_form";
import { ApprovalFailedError, TransactionFailedError } from "../../utils/error";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addBundle, finishLoading, startLoading } from "../../redux/slices/bundles_slice";
import { BundleData } from "../../backend/bundle_data";
import PolicyConfirmation from "./policy_confirmation";

export interface ApplicationProps {
    insurance: InsuranceApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];
export const REVOKE_INFO_URL = "https://metamask.zendesk.com/hc/en-us/articles/4446106184731-How-to-revoke-smart-contract-allowances-token-approvals";

export default function Application(props: ApplicationProps) {
    const { t } = useTranslation(['application', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const dispatch = useDispatch();

    const [ activeStep, setActiveStep ] = useState(isConnected ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ walletAddress, setWalletAddress ] = useState("");
    const [ readyToBuy, setReadyToBuy ] = useState(false);
    const [ premiumTrxTextKey, setPremiumTrxTextKey ] = useState("");
    // processId, walletAddress, amount, duration (days)
    const [ protectionDetails, setProctectionDetails ] = useState(["0x", "0x", BigNumber.from(0), 30]);

    async function walletDisconnected() {
        setWalletAddress("");
    }

    // get bundle data once the wallet is connected
    useEffect(() => {
        async function asyncGetBundles() {
            await props.insurance.application.getRiskBundles(
                (bundle: BundleData) => dispatch(addBundle(bundle)) 
            );
            dispatch(finishLoading());
            setPremiumTrxTextKey("");
        }

        // console.log("signer", signer);
        if (signer !== undefined && ! (signer instanceof VoidSigner)) {
            dispatch(startLoading());
            setPremiumTrxTextKey('bundle_loading');
            console.log("got a new signer ... getting bundles");
            asyncGetBundles();
        }    
    }, [signer]);
    
    // change steps according to application state
    useEffect(() => {
        if (! isConnected) {
            setActiveStep(0);
            walletDisconnected();
        } else if (activeStep < 1 && isConnected) {
            setActiveStep(1);
            updateWalletAddress(signer!);
        } else if (activeStep == 1 && readyToBuy) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToBuy) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [signer, isConnected, activeStep, readyToBuy]);

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
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
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

    async function doApplication(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number): Promise<{ status: boolean, processId: string|undefined}> {
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
                return Promise.resolve({ status: false, processId: undefined });
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

    async function applyForPolicy(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number) {
        try {
            enableUnloadWarning(true);

            setActiveStep(3);
            const approvalSuccess = await doApproval(walletAddress, premium);
            if ( ! approvalSuccess) {
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            setActiveStep(4);
            const applicationResult = await doApplication(walletAddress, insuredAmount, coverageDuration, premium);
            if ( ! applicationResult.status ) {
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            setActiveStep(5);
            applicationSuccessful();
            setProctectionDetails([applicationResult.processId as string, walletAddress, BigNumber.from(insuredAmount), coverageDuration])
        } finally {
            enableUnloadWarning(false);
        }
    }

    async function updateWalletAddress(signer: Signer) {
        setWalletAddress(await signer.getAddress());
    }

    if (isConnected) {
        updateWalletAddress(signer!);
    }

    let content;
    if (activeStep < 5) {
        content = (
            <ApplicationForm 
                formDisabled={formDisabled}
                walletAddress={walletAddress}
                usd1={props.insurance.usd1}
                usd1Decimals={props.insurance.usd1Decimals}
                usd2={props.insurance.usd2}
                usd2Decimals={props.insurance.usd2Decimals}
                applicationApi={props.insurance.application}
                formReadyForApply={formReadyForApply}
                applyForPolicy={applyForPolicy}
                premiumTrxTextKey={premiumTrxTextKey}
            />
        );
    } else {
        content = (
            <PolicyConfirmation
                processId={protectionDetails[0] as string}
                wallet={protectionDetails[1] as string}
                amount={protectionDetails[2] as BigNumber}
                duration={protectionDetails[3] as number}
                currency={props.insurance.usd1}
                currencyDecimals={props.insurance.usd1Decimals}
                />);
    }

    return (
        <>
            <div>
                <Typography variant="h5" mb={2}>{t('title', { currency: props.insurance.usd1 })}</Typography>

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
                
                {content}
            </div>
        </>
    );
}