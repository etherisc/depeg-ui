import { Alert, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { BackendApi } from "../../backend/backend_api";
import { SnackbarKey, useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import { BigNumber, Signer } from "ethers";
import { formatCurrencyBN } from "../../utils/numbers";
import ApplicationForm from "./application_form";
import { ApprovalFailedError, TransactionFailedError } from "../../utils/error";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addBundle, finishLoading, reset, startLoading } from "../../redux/slices/application";
import { BundleData } from "../../backend/bundle_data";
import PolicyConfirmation from "./policy_confirmation";
import { updateAccountBalance } from "../../utils/chain";
import { setProductState } from "../../redux/slices/price";
import { ProductState } from "../../types/product_state";

export interface ApplicationProps {
    insurance: BackendApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];
export const REVOKE_INFO_URL = "https://metamask.zendesk.com/hc/en-us/articles/4446106184731-How-to-revoke-smart-contract-allowances-token-approvals";

export default function Application(props: ApplicationProps) {
    const { t } = useTranslation(['application', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const productState = useSelector((state: RootState) => state.price.productState);
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
        async function asyncGetProductStateAndBundles() {
            let productState = await props.insurance.getProductState();
            dispatch(setProductState(productState));
            await props.insurance.application.fetchStakeableRiskBundles((bundle: BundleData) => dispatch(addBundle(bundle)));
            dispatch(finishLoading());
            setPremiumTrxTextKey("");
        }

        // console.log("signer", signer);
        if (isConnected) {
            dispatch(startLoading());
            dispatch(reset());
            setPremiumTrxTextKey('bundle_loading');
            asyncGetProductStateAndBundles();
        }    
    }, [isConnected, dispatch]);
    
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

    function readyToSubmit(isFormReady: boolean) {
        setReadyToBuy(isFormReady);
    }

    async function applicationSuccessful(bundleId: number) {
        props.insurance.triggerBundleUpdate(bundleId, dispatch);

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        updateAccountBalance(signer!, dispatch);
    }

    async function doApproval(walletAddress: string, premium: BigNumber): Promise<Boolean> {
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.insurance.createTreasuryApproval(
                walletAddress, 
                premium, 
                (address, currency, amount) => {
                    snackbar = enqueueSnackbar(
                        t('approval_info', { address, currency, amount: formatCurrencyBN(amount, props.insurance.usd1Decimals) }),
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

    async function doApplication(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, bundleId: number): Promise<{ status: boolean, processId: string|undefined}> {
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.insurance.application.applyForPolicy(
                walletAddress, 
                insuredAmount, 
                coverageDuration, 
                bundleId, 
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

    async function applyForPolicy(walletAddress: string, insuredAmount: BigNumber, coverageDurationSeconds: number, premium: BigNumber, bundleId: number) {
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
            const applicationResult = await doApplication(walletAddress, insuredAmount, coverageDurationSeconds, bundleId);
            if ( ! applicationResult.status ) {
                setActiveStep(2);
                showAllowanceNotice();
                return;
            }
            setActiveStep(5);
            await applicationSuccessful(bundleId);
            setProctectionDetails([applicationResult.processId as string, walletAddress, insuredAmount, coverageDurationSeconds])
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
                formDisabled={formDisabled || productState !== ProductState.Active}
                connectedWalletAddress={walletAddress}
                usd1={props.insurance.usd1}
                usd1Decimals={props.insurance.usd1Decimals}
                usd2={props.insurance.usd2}
                usd2Decimals={props.insurance.usd2Decimals}
                insuranceApi={props.insurance}
                applicationApi={props.insurance.application}
                readyToSubmit={readyToSubmit}
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
                coverageDurationSeconds={protectionDetails[3] as number}
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

                { productState !== ProductState.Active && (<Alert severity="error" variant="outlined" sx={{ mt: 4 }}>{t('alert.product_not_active')}</Alert>)}
                
                {content}
            </div>
        </>
    );
}