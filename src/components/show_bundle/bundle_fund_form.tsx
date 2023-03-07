import { faArrowLeft, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { BundleData } from "../../backend/bundle_data";
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS } from "../../config/appConfig";
import { INPUT_VARIANT } from "../../config/theme";
import { RootState } from "../../redux/store";
import TermsAndConditions from "../terms_and_conditions";

interface BundleFundFormProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
    maxInvestedAmount: BigNumber;
    getRemainingCapacity: () => Promise<number>;
    doFund: (bundleId: number, amount: BigNumber) => Promise<boolean>;
    doCancel: () => void;
}

export type IFundFormValues = {
    amount: string;
    termsAndConditions: boolean;
};

export default function BundleFundForm(props: BundleFundFormProps) {
    const { t } = useTranslation('bundles');

    const [ fundInProgress, setFundInProgress ] = useState(false);
    const [ maxFundAmount, setMaxFundAmount ] = useState(props.maxInvestedAmount.toNumber());
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const getRemainingCapacity = props.getRemainingCapacity;

    const minFundAmount = 1;

    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IFundFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            amount: "0",
            termsAndConditions: false,
        }
    });

    useEffect(() => {
        async function checkMaxInvestedAmount() {
            const riskpoolRemainingCapacity = await getRemainingCapacity();
            console.log("riskpoolRemainingCapacity", riskpoolRemainingCapacity.toString());
            if (riskpoolRemainingCapacity < maxFundAmount) {
                console.log("updating maxFundAmount");
                setMaxFundAmount(riskpoolRemainingCapacity);
                setValue("amount", riskpoolRemainingCapacity.toString());
            }
        }
        if (process.env.NEXT_PUBLIC_FEATURE_RISKPOOL_CAPACITY_LIMIT === "true" && isConnected) {
            checkMaxInvestedAmount();
        }
    }, [isConnected, getRemainingCapacity, maxFundAmount, setValue]);

    const errors = useMemo(() => formState.errors, [formState]);
    
    const onSubmit: SubmitHandler<IFundFormValues> = async data => {
        console.log("submit clicked", data);
        setFundInProgress(true);

        try {
            const values = getValues();
            const amount = parseUnits(values.amount, props.decimals);
            await props.doFund(props.bundle.id, amount);
        } finally {
            setFundInProgress(false);
        }
    }

    const readyToSubmit = formState.isValid;
    const loadingBar = fundInProgress ? <LinearProgress /> : null;

    return (<>
        <Typography variant="h6" m={2} mt={4}>{t('title_fund')}</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{ required: true, min: minFundAmount, max: maxFundAmount, pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS }}
                        render={({ field }) => 
                            <TextField 
                                label={t('amount')}
                                fullWidth
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.currency}</InputAdornment>,
                                }}
                                error={errors.amount !== undefined}
                                helperText={errors.amount !== undefined 
                                    ? ( errors.amount.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.amount.type}`, { "ns": "common", "minValue": `${props.currency} ${minFundAmount}`, "maxValue": `${props.currency} ${maxFundAmount}` })
                                    ) : ""}
                                data-testid="amount"
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="termsAndConditions"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    defaultChecked={false}
                                    {...field}
                                    data-testid="t-and-c"
                                    />
                            } 
                            label={<TermsAndConditions />} />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                        <Button 
                            variant='outlined'
                            type="reset"
                            fullWidth
                            onClick={props.doCancel}
                            sx={{ p: 1, m: 1 }}
                            data-testid="cancel-button"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="fa" />
                            {t('action.cancel')}
                        </Button>
                        <Button 
                            variant='contained'
                            type="submit"
                            disabled={!readyToSubmit}
                            fullWidth
                            sx={{ p: 1, m: 1 }}
                            data-testid="fund-button"
                            >
                                <FontAwesomeIcon icon={faMoneyBillTransfer} className="fa" />
                                {t('action.fund')}
                        </Button>
                    </Box>
                    {loadingBar}
                </Grid>
            </Grid>
        </form>
    </>);
}