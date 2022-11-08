import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/signer_context";
import { InsuranceData } from "../../utils/insurance_data";

export interface ApplicationProps {
    insurance: InsuranceData;
}

const steps = ['Connect wallet', 'Enter data', 'Buy', 'Confirm premium allowance', 'Confirm payment'];

export default function Application(props: ApplicationProps) {
    const signerContext = useContext(SignerContext);
    const [activeStep, setActiveStep] = useState(signerContext?.data.signer === undefined ? 0 : 1);

    useEffect(() => {
        console.log("signer changed");
        if (activeStep < 1 && signerContext?.data.signer !== undefined) {
            setActiveStep(1);
        } else if (signerContext?.data.signer === undefined) {
            setActiveStep(0);
        }
        
    }, [signerContext?.data.signer, activeStep]);

    return (
        <>
            <Head>
                <title>Etherisc {props.insurance.usd1} depeg protection</title>
            </Head>
            <div>
                <Typography variant="h5" mb={2} >Apply for {props.insurance.usd1} depeg protection</Typography>

                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        </>
    );
}