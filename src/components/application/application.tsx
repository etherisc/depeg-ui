import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/signer_context";
import { useTranslation } from 'next-i18next';
import { InsuranceApi } from "../../model/insurance_api";
import Form from "./form";
import { useSnackbar } from "notistack";
import confetti from "canvas-confetti";

export interface ApplicationProps {
    insurance: InsuranceApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

export default function Application(props: ApplicationProps) {
    const { t } = useTranslation(['application', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const signerContext = useContext(SignerContext);
    const [ activeStep, setActiveStep ] = useState(signerContext?.data.signer === undefined ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ walletAddress, setWalletAddress ] = useState("");
    const [ readyToBuy, setReadyToBuy ] = useState(false);

    async function walletDisconnected() {
        setWalletAddress("");
    }

    if (signerContext?.data.signer !== undefined) {
        signerContext?.data.signer.getAddress().then((address) => {
            setWalletAddress(address);
        });
    }    

    // change steps according to application state
    useEffect(() => {
        if (signerContext?.data.signer === undefined) {
            setActiveStep(0);
            walletDisconnected();
        } else if (activeStep < 1 && signerContext?.data.signer !== undefined) {
            setActiveStep(1);
            signerContext?.data.signer.getAddress().then((address) => {
                // console.log("address: ", address);
                setWalletAddress(address);
            });
        } else if (activeStep == 1 && readyToBuy) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToBuy) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [signerContext?.data.signer, activeStep, readyToBuy]);

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
                persist: true, 
                preventDuplicate: true,
                action: (key) => {
                    return (
                        <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                    );
                }
            }
        );
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    async function applyForPolicy(walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number): Promise<boolean> {
        setActiveStep(3);
        await props.insurance.createApproval(walletAddress, premium);
        // FIXME: handle error during approval
        setActiveStep(4);
        await props.insurance.applyForPolicy(walletAddress, insuredAmount, coverageDuration);
        // FIXME: handle error during apply for policy
        setActiveStep(5);
        applicationSuccessful();
        return Promise.resolve(true);        
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

                <Form 
                    disabled={formDisabled}
                    walletAddress={walletAddress}
                    insurance={props.insurance}
                    formReadyForApply={formReadyForApply}
                    applyForPolicy={applyForPolicy}
                />
            </div>
        </>
    );
}