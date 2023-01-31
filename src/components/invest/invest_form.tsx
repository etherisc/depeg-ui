import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { BackendApi } from '../../backend/backend_api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { INPUT_VARIANT } from '../../config/theme';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS, REGEX_PATTERN_NUMBER_WITH_DECIMALS } from '../../config/appConfig';
import { parseUnits } from 'ethers/lib/utils';

const formInputVariant = 'outlined';

export interface InvestFormProperties {
    formDisabled: boolean;
    usd2: string;
    usd2Decimals: number;
    insurance: BackendApi;
    formReadyForInvest: (isFormReady: boolean) => void;
    invest: (
        name: string, lifetime: number, 
        investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
        minDuration: number, maxDuration: number, annualPctReturn: number
    ) => void;
}

export type IInvestFormValues = {
    bundleName: string,
    lifetime: string;
    lifetimeEndDate: string;
    investedAmount: string;
    insuredAmountMin: string;
    insuredAmountMax: string;
    coverageDurationMin: string;
    coverageDurationMax: string;
    annualPctReturn: string;
    termsAndConditions: boolean;
};

export default function InvestForm(props: InvestFormProperties) {
    const { t } = useTranslation('invest');
    const investProps = props.insurance.invest;
    const minLifetimeDays = investProps.minLifetime;
    const minLifetimeEndDate = dayjs().add(minLifetimeDays, 'days').format("YYYY-MM-DD");
    const maxLifetimeDays = investProps.maxLifetime;
    const maxLifetimeEndDate = dayjs().add(maxLifetimeDays, 'days').format("YYYY-MM-DD");
    const minInvestedAmount = investProps.minInvestedAmount.toNumber();
    const maxInvestedAmount = investProps.maxInvestedAmount.toNumber();
    const minSumInsured = investProps.minSumInsured.toNumber();
    const maxSumInsured = investProps.maxSumInsured.toNumber();
    const minCoverageDuration = investProps.minCoverageDuration;
    const maxCoverageDuration = investProps.maxCoverageDuration;
    const annualPctReturn = investProps.annualPctReturn;
    const maxAnnualPctReturn = investProps.maxAnnualPctReturn;

    const defaultLifetime = 90;

    const { handleSubmit, control, formState, getValues, setValue, watch, trigger } = useForm<IInvestFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            bundleName: '',
            lifetime: defaultLifetime.toString(),
            lifetimeEndDate: dayjs().add(defaultLifetime, 'days').format("YYYY-MM-DD"),
            investedAmount: maxInvestedAmount.toString(),
            insuredAmountMin: minSumInsured.toString(),
            insuredAmountMax: maxSumInsured.toString(),
            coverageDurationMin: minCoverageDuration.toString(),
            coverageDurationMax: maxCoverageDuration.toString(),
            annualPctReturn: annualPctReturn.toString(),
            termsAndConditions: false
        }
    });

    const errors = useMemo(() => formState.errors, [formState]);

    // handle changes in insured amount min/max / coverage duration and validate the other field accordingly
    const watchInsuredAmountMin = watch("insuredAmountMin");
    useEffect(() => {
        // console.log("insuredAmountMin changed", watchInsuredAmountMin);
        trigger(["insuredAmountMax", "insuredAmountMin"]);
    }, [watchInsuredAmountMin, trigger]);

    const watchInsuredAmountMax = watch("insuredAmountMax");
    useEffect(() => {
        // console.log("insuredAmountMax changed", watchInsuredAmountMax);
        trigger("insuredAmountMin");
    }, [watchInsuredAmountMax, trigger]);

    const watchCoverageDurationMin = watch("coverageDurationMin");
    useEffect(() => {
        trigger("coverageDurationMax");
    }, [watchCoverageDurationMin, trigger]);

    const watchCoverageDurationMax = watch("coverageDurationMax");
    useEffect(() => {
        trigger("coverageDurationMin");
    }, [watchCoverageDurationMax, trigger]);

    const [ paymentInProgress, setPaymentInProgress ] = useState(false);

    const onSubmit: SubmitHandler<IInvestFormValues> = async data => {
        console.log("submit clicked", data);
        setPaymentInProgress(true);

        try {
            const values = getValues();
            const bundleName = values.bundleName;
            const lifetime = parseInt(values.lifetime) * 24 * 60 * 60;
            const investedAmount = parseUnits(values.investedAmount, props.usd2Decimals);
            const minSumInsured = parseUnits(values.insuredAmountMin, props.usd2Decimals);
            const maxSumInsured = parseUnits(values.insuredAmountMax, props.usd2Decimals);
            const minDuration = parseInt(values.coverageDurationMin);
            const maxDuration = parseInt(values.coverageDurationMax);
            const annualPctReturn = parseFloat(values.annualPctReturn);
            await props.invest(bundleName, lifetime, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        } finally {
            setPaymentInProgress(false);
        }
    }

    const waitForPayment = paymentInProgress ? <LinearProgress /> : null;
    
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={4} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Controller
                        name="bundleName"
                        control={control}
                        rules={{ 
                            required: true, 
                            minLength: 3,
                            maxLength: 32,
                            pattern: /^[A-Za-z0-9 _-]+$/,
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('bundleName')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                error={errors.bundleName !== undefined}
                                helperText={errors.bundleName !== undefined 
                                    ? 
                                        (errors.bundleName.type === 'pattern' 
                                            ? t(`error.name.pattern`)  
                                            : t(`error.field.${errors.bundleName.type}`, { "ns": "common", "minLength": 3, "maxLength": 32 })
                                        ) 
                                    : ""
                                }
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="lifetime"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minLifetimeDays, 
                            max: maxLifetimeDays, 
                            pattern: /^[0-9]+$/ 
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('lifetime')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{t('days')}</InputAdornment>,
                                }}
                                onBlur={(e) => {
                                    field.onBlur();
                                    setValue("lifetimeEndDate", dayjs().startOf('day').add(parseInt(e.target.value), 'days').format("YYYY-MM-DD"));
                                }}
                                error={errors.lifetime !== undefined}
                                helperText={errors.lifetime !== undefined 
                                    ? ( errors.lifetime.type == 'pattern' 
                                            ? t(`error.field.numberType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.lifetime.type}`, { "ns": "common", "minValue": minLifetimeDays, "maxValue": maxLifetimeDays }) 
                                    ) : t('lifetime_hint')}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="lifetimeEndDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                            <DatePicker
                                {...field} 
                                label={t('lifetimeUntil')}
                                inputFormat="DD.MM.YYYY"
                                disabled={props.formDisabled}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params}
                                        fullWidth 
                                        variant={INPUT_VARIANT} 
                                        />
                                }
                                onAccept={(value: string|null) => {
                                    if (value !== null) {
                                        setValue("lifetime", dayjs(value).startOf('day').diff(dayjs().startOf('day'), 'days').toString()); 
                                    }
                                }}
                                disablePast={true}
                                minDate={minLifetimeEndDate}
                                maxDate={maxLifetimeEndDate}
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="investedAmount"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minInvestedAmount, 
                            max: maxInvestedAmount,
                            pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS,
                            validate: {
                                balance: async (value) => {
                                    const walletAddress = await props.insurance.getWalletAddress();
                                    const investedAmount = BigNumber.from(parseFloat(value) * Math.pow(10, props.usd2Decimals));
                                    return  props.insurance.hasUsd2Balance(walletAddress, investedAmount);
                                }
                            }
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('investedAmount')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>,
                                }}
                                error={errors.investedAmount !== undefined}
                                helperText={errors.investedAmount !== undefined 
                                    ? ( errors.investedAmount.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.investedAmount.type}`, { "ns": "common", "minValue": `${props.usd2} ${minInvestedAmount}`, "maxValue": `${props.usd2} ${maxInvestedAmount}` }) 
                                    ) : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="insuredAmountMin"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minSumInsured, 
                            max: maxSumInsured,
                            pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS,
                            validate: {
                                minmax: (v: string) => parseFloat(v) <= parseFloat(watchInsuredAmountMax)
                            }
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('minSumInsured')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>,
                                }}
                                error={errors.insuredAmountMin !== undefined}
                                helperText={errors.insuredAmountMin !== undefined 
                                    ? ( errors.insuredAmountMin.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.insuredAmountMin.type}`, { "ns": "common", "minValue": `${props.usd2} ${minSumInsured}`, "maxValue": `${props.usd2} ${maxSumInsured}` }) 
                                    ) : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="insuredAmountMax"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minSumInsured, 
                            max: maxSumInsured,
                            pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS,
                            validate: {
                                minmax: (v: string) => parseFloat(watchInsuredAmountMin) <= parseFloat(v)
                            }                        
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('maxSumInsured')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>,
                                }}
                                error={errors.insuredAmountMax !== undefined}
                                helperText={errors.insuredAmountMax !== undefined 
                                    ? ( errors.insuredAmountMax.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.insuredAmountMax.type}`, { "ns": "common", "minValue": `${props.usd2} ${minSumInsured}`, "maxValue": `${props.usd2} ${maxSumInsured}` }) 
                                    ) : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="coverageDurationMin"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minCoverageDuration, 
                            max: maxCoverageDuration, 
                            pattern: /^[0-9]+$/,
                            validate: {
                                minmax: (v:string) => parseFloat(v) <= parseFloat(watchCoverageDurationMax)
                            }
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('minDuration')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{t('days')}</InputAdornment>,
                                }}
                                error={errors.coverageDurationMin !== undefined}
                                helperText={errors.coverageDurationMin !== undefined 
                                    ? ( errors.coverageDurationMin.type == 'pattern' 
                                        ? t(`error.field.numberType`, { "ns": "common"})
                                        :  t(`error.field.${errors.coverageDurationMin.type}`, { "ns": "common", "minValue": minCoverageDuration, "maxValue": maxCoverageDuration })
                                    )
                                    : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="coverageDurationMax"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minCoverageDuration, 
                            max: maxCoverageDuration, 
                            pattern: /^[0-9]+$/,
                            validate: {
                                minmax: (v:string) => parseFloat(watchCoverageDurationMin) <= parseFloat(v)
                            }
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('maxDuration')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{t('days')}</InputAdornment>,
                                }}
                                error={errors.coverageDurationMax !== undefined}
                                helperText={errors.coverageDurationMax !== undefined 
                                    ? ( errors.coverageDurationMax.type == 'pattern' 
                                        ? t(`error.field.numberType`, { "ns": "common"})
                                        : t(`error.field.${errors.coverageDurationMax.type}`, { "ns": "common", "minValue": minCoverageDuration, "maxValue": maxCoverageDuration }) 
                                    )
                                    : t('max_duration_hint')}
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="annualPctReturn"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: 0.01, 
                            max: maxAnnualPctReturn,
                            pattern: REGEX_PATTERN_NUMBER_WITH_DECIMALS,
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('annualPercentageReturn')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                error={errors.annualPctReturn !== undefined}
                                helperText={errors.annualPctReturn !== undefined 
                                    ? ( errors.annualPctReturn.type == 'pattern' 
                                        ? t(`error.field.numberTypeFloat`, { "ns": "common"})
                                        : t(`error.field.${errors.annualPctReturn.type}`, { "ns": "common", "minValue": 0.01, "maxValue": maxAnnualPctReturn })
                                    )
                                    : ""}
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
                            disabled={props.formDisabled}
                            label={t('checkbox_t_and_c_label')} 
                            />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant='contained'
                        type='submit'
                        disabled={props.formDisabled || ! formState.isValid || paymentInProgress}
                        fullWidth
                        sx={{ p: 1 }}
                        >
                        <FontAwesomeIcon icon={faSackDollar} className="fa" />
                        {t('button_invest')}
                    </Button>
                    {waitForPayment}
                </Grid>
            </Grid>
        </form>
    </>);
}