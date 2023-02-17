import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BundleData } from "../../backend/bundle_data";
import { REGEX_PATTERN_NUMBER_WITH_DECIMALS } from "../../config/appConfig";
import { INPUT_VARIANT } from "../../config/theme";

interface BundleWithdrawFormProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
    doWithdraw: (bundleId: number, amount: BigNumber) => Promise<boolean>;
}

export type IWithdrawFormValues = {
    amount: string;
};

export default function BundleWithdrawForm(props: BundleWithdrawFormProps) {
    const { t } = useTranslation('bundles');

    const [ withdrawInProgress, setWithdrawInProgress ] = useState(false);

    const balance = BigNumber.from(props.bundle.balance);
    const locked = BigNumber.from(props.bundle.locked);
    {/* TODO MZ: is this correct? */}
    const maxWithdrawAmountBN = balance.sub(locked);
    const maxWithdrawAmount = parseFloat(formatUnits(maxWithdrawAmountBN, props.decimals));
    const minWithdrawAmount = 1;

    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IWithdrawFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            amount: "0",
        }
    });

    const errors = useMemo(() => formState.errors, [formState]);
    
    const onSubmit: SubmitHandler<IWithdrawFormValues> = async data => {
        console.log("submit clicked", data);
        setWithdrawInProgress(true);

        try {
            const values = getValues();
            const amount = parseUnits(values.amount, props.decimals);
            await props.doWithdraw(props.bundle.id, amount);
        } finally {
            setWithdrawInProgress(false);
        }
    }

    const readyToSubmit = formState.isValid;
    const loadingBar = withdrawInProgress ? <LinearProgress /> : null;

    return (<>
        <Typography variant="h6" m={2} mt={4}>{t('title_withdraw')}</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{ required: true, min: minWithdrawAmount, max: maxWithdrawAmount, pattern: REGEX_PATTERN_NUMBER_WITH_DECIMALS }}
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
                                            : t(`error.field.${errors.amount.type}`, { "ns": "common", "minValue": `${props.currency} ${minWithdrawAmount}`, "maxValue": `${props.currency} ${maxWithdrawAmount}` })
                                    ) : ""}
                                data-testid="insuredAmount"
                                />}
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
                        {t('action.withdraw')}
                    </Button>
                    {/* TODO: cancel button */}
                    {loadingBar}
                </Grid>
            </Grid>
        </form>
    </>);
}