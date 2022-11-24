import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import { useTranslation } from 'next-i18next';
import { InsuranceApi } from "../../model/insurance_api";
import { useSnackbar } from "notistack";
import confetti from "canvas-confetti";
import InvestForm from "./invest_form";

export interface InvestProps {
    insurance: InsuranceApi;
}

const steps = ['step0', 'step1', 'step2', 'step3', 'step4'];

export default function Invest(props: InvestProps) {
    const { t } = useTranslation(['invest', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const appContext = useContext(AppContext);
    const [ activeStep, setActiveStep ] = useState(appContext?.data.signer === undefined ? 0 : 1);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const [ readyToInvest, setReadyToInvest ] = useState(false);


    // change steps according to application state
    useEffect(() => {
        if (appContext?.data.signer === undefined) {
            setActiveStep(0);
        } else if (activeStep < 1 && appContext?.data.signer !== undefined) {
            setActiveStep(1);
        } else if (activeStep == 1 && readyToInvest) {
            setActiveStep(2);
        } else if (activeStep == 2 && !readyToInvest) { 
            setActiveStep(1);
        } else if (activeStep > 4) { // application completed
            setFormDisabled(true);
        }
    }, [appContext?.data.signer, activeStep, readyToInvest]);

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

    async function invest(investedAmount: number, minSumInsured: number, maxSumInsured: number, minDuration: number, maxDuration: number, annualPctReturn: number): Promise<boolean> {
        setActiveStep(3);
        const investorWalletAddress = await appContext!!.data.signer!!.getAddress();
        await props.insurance.createTreasuryApproval(investorWalletAddress, investedAmount);
        // FIXME: handle error during approval
        setActiveStep(4);
        await props.insurance.invest.invest(investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        // FIXME: handle error during investment
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

                <InvestForm 
                    disabled={formDisabled}
                    usd1={props.insurance.usd1}
                    usd1Decimals={props.insurance.usd1Decimals}
                    insurance={props.insurance}
                    formReadyForInvest={formReadyForInvest}
                    invest={invest}
                />
            </div>
        </>
    );
}