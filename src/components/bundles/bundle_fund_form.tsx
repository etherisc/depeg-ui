import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, FormControlLabel, Grid, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BundleData } from "../../backend/bundle_data";
import { REGEX_PATTERN_NUMBER_WITH_DECIMALS } from "../../config/appConfig";
import { INPUT_VARIANT } from "../../config/theme";

interface BundleFundFormProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
    doFund: (bundleId: number, amount: BigNumber) => Promise<boolean>;
}

export type IFundFormValues = {
    amount: string;
    termsAndConditions: boolean;
};

export default function BundleFundForm(props: BundleFundFormProps) {
    const { t } = useTranslation('bundles');

    const [ fundInProgress, setFundInProgress ] = useState(false);

    // FIXME: get real max fund amount here
    const maxFundAmountBN = BigNumber.from(100000000000)
    const maxFundAmount = parseFloat(formatUnits(maxFundAmountBN, props.decimals));
    const minFundAmount = 1;

    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IFundFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            amount: "0",
            termsAndConditions: false,
        }
    });

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
                        rules={{ required: true, min: minFundAmount, max: maxFundAmount, pattern: REGEX_PATTERN_NUMBER_WITH_DECIMALS }}
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
                                data-testid="insuredAmount"
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
                                    />
                            } 
                            label={t('checkbox_t_and_c_label')} />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant='contained'
                        type="submit"
                        disabled={!readyToSubmit}
                        fullWidth
                        sx={{ p: 1 }}
                    >
                        <FontAwesomeIcon icon={faMoneyBillTransfer} className="fa" />
                        {t('action.fund')}
                    </Button>
                    {/* TODO: cancel button */}
                    {loadingBar}
                </Grid>
            </Grid>
        </form>
    </>);
}