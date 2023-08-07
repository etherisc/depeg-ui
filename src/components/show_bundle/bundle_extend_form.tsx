import { faArrowLeft, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { BundleData } from "../../backend/bundle_data";
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS } from "../../utils/const";
import { INPUT_VARIANT } from "../../config/theme";
import { RootState } from "../../redux/store";
import TermsOfService from "../terms_of_service";

interface BundleExtendFormProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
    maxStakedAmount: BigNumber;
    getBundleCapitalCap: () => Promise<BigNumber>;
    getRemainingRiskpoolCapacity: () => Promise<number>;
    doExtend: (bundle: BundleData) => Promise<boolean>;
    doCancel: () => void;
}

export type IFundFormValues = {
    amount: string;
    termsAndConditions: boolean;
};

export default function BundleExtendForm(props: BundleExtendFormProps) {
    const { t } = useTranslation('bundles');

    // TODO: implement correct form with just a date for extension. min and max from bundle end date

    const [ fundInProgress, setFundInProgress ] = useState(false);
    const [ maxFundAmount, setMaxFundAmount ] = useState(props.maxStakedAmount.toNumber());
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const getRemainingCapacity = props.getRemainingRiskpoolCapacity;
    const decimals = props.decimals;
    const bundle = props.bundle;
    const getBundleCapitalCap = props.getBundleCapitalCap;

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
        async function checkMaxFundAmount() {
            let fundAmountMaxBN = parseUnits(maxFundAmount.toString(), decimals);

            const bundleCapital = BigNumber.from(bundle.capital);
            const bundleCapitalCapBN = await getBundleCapitalCap();
            // remaining capacity of the bundle
            fundAmountMaxBN = bundleCapitalCapBN.sub(bundleCapital);
            let fundAmountMax = parseFloat(formatUnits(fundAmountMaxBN, decimals));
            console.log("fundAmountMax", fundAmountMax);

            const riskpoolRemainingCapacity = await getRemainingCapacity();
            console.log("riskpoolRemainingCapacity", riskpoolRemainingCapacity.toString());
            if (riskpoolRemainingCapacity < fundAmountMax) {
                fundAmountMax = riskpoolRemainingCapacity;
            }

            setMaxFundAmount(fundAmountMax);
        }
        if (isConnected) {
            checkMaxFundAmount();
        }
    }, [isConnected, getRemainingCapacity, maxFundAmount, setValue, bundle, decimals, getBundleCapitalCap]);

    const errors = useMemo(() => formState.errors, [formState]);
    
    const onSubmit: SubmitHandler<IFundFormValues> = async data => {
        console.log("submit clicked", data);
        setFundInProgress(true);

        try {
            const values = getValues();
            const amount = parseUnits(values.amount, props.decimals);
            await props.doExtend({} as BundleData);
        } finally {
            setFundInProgress(false);
        }
    }

    const bundleIsAsCapacity = maxFundAmount <= 0;

    if (bundleIsAsCapacity) {
        return (<>
            <Typography variant="h6" m={2} mt={4}>{t('title_fund')}</Typography>
            <Alert severity="error" variant="outlined" sx={{ mt: 4 }} data-testid="alert-bundle-at-capacity">{t('alert.bundle_at_capacity')}</Alert>
        </>);
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
                            label={<TermsOfService />} />}
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