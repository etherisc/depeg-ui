import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { InsuranceApi } from '../../backend/insurance_api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { INPUT_VARIANT } from '../../config/theme';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

const formInputVariant = 'outlined';

export interface InvestFormProperties {
    formDisabled: boolean;
    usd2: string;
    usd2Decimals: number;
    insurance: InsuranceApi;
    formReadyForInvest: (isFormReady: boolean) => void;
    invest: (name: string, lifetime: number, investedAmount: number, minSumInsured: number, maxSumInsured: number, minDuration: number, maxDuration: number, annualPctReturn: number) => void;
}

export type IInvestFormValues = {
    bundleName: string,
    lifetime: number;
    lifetimeEndDate: string;
    investedAmount: number;
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationMin: number;
    coverageDurationMax: number;
    annualPctReturn: number;
    termsAndConditions: boolean;
};

export default function InvestForm(props: InvestFormProperties) {
    const { t } = useTranslation('invest');
    const investProps = props.insurance.invest;
    const minInvestedAmount = investProps.minInvestedAmount / Math.pow(10, props.usd2Decimals);
    const maxInvestedAmount = investProps.maxInvestedAmount / Math.pow(10, props.usd2Decimals);
    const minSumInsured = investProps.minSumInsured / Math.pow(10, props.usd2Decimals);
    const maxSumInsured = investProps.maxSumInsured / Math.pow(10, props.usd2Decimals);
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
            lifetime: defaultLifetime,
            lifetimeEndDate: moment().add(defaultLifetime, 'days').format("YYYY-MM-DD"),
            investedAmount: maxInvestedAmount,
            insuredAmountMin: minSumInsured,
            insuredAmountMax: maxSumInsured,
            coverageDurationMin: minCoverageDuration,
            coverageDurationMax: maxCoverageDuration,
            annualPctReturn: annualPctReturn,
            termsAndConditions: false
        }
    });

    const errors = useMemo(() => formState.errors, [formState]);

    // handle changes in lifetime duration / end date and update the other field accordingly
    const watchLifetime = watch("lifetime");
    useEffect(() => {
        setValue("lifetimeEndDate", moment().startOf('day').add(watchLifetime, 'days').format("YYYY-MM-DD"));
    }, [watchLifetime, setValue]);

    const watchLifetimeEndDate = watch("lifetimeEndDate");
    useEffect(() => {
        setValue("lifetime", moment(watchLifetimeEndDate).startOf('day').diff(moment().startOf('day'), 'days')); 
    }, [watchLifetimeEndDate, setValue]);

    // handle changes in insured amount min/max / coverage duration and validate the other field accordingly
    const watchInsuredAmountMin = watch("insuredAmountMin");
    useEffect(() => {
        trigger("insuredAmountMax");
    }, [watchInsuredAmountMin, trigger]);

    const watchInsuredAmountMax = watch("insuredAmountMax");
    useEffect(() => {
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
            const lifetime = values.lifetime * 24 * 60 * 60;
            const investedAmount = values.investedAmount * Math.pow(10, props.usd2Decimals);
            const minSumInsured = values.insuredAmountMin * Math.pow(10, props.usd2Decimals);
            const maxSumInsured = values.insuredAmountMax * Math.pow(10, props.usd2Decimals);
            const minDuration = values.coverageDurationMin;
            const maxDuration = values.coverageDurationMax;
            const annualPctReturn = values.annualPctReturn;
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
                                    ? t(`error.field.${errors.bundleName.type}`, { "ns": "common", "minLength": 3, "maxLength": 32 }) 
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
                            // FIXME: min: coverageDaysMin, 
                            // max: coverageDaysMax, 
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
                                error={errors.lifetime !== undefined}
                                helperText={errors.lifetime !== undefined 
                                    ? ( errors.lifetime.type == 'pattern' 
                                            ? t(`error.field.numberType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.lifetime.type}`, 
                                                    // FIXME: { "ns": "common", "minValue": coverageDaysMin, "maxValue": coverageDaysMax }
                                                    { "ns": "common" }
                                                ) 
                                    ) : ""}
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
                                disablePast={true}
                                // FIXME: minDate={coverageUntilMin}
                                // maxDate={coverageUntilMax}
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
                            pattern: /^[0-9.]+$/
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
                            pattern: /^[0-9.]+$/,
                            validate: {
                                minmax: v => v <= watchInsuredAmountMax 
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
                            pattern: /^[0-9.]+$/,
                            validate: {
                                minmax: v => v >= watchInsuredAmountMin
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
                                minmax: v => v <= watchCoverageDurationMax
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
                                minmax: v => v >= watchCoverageDurationMin
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
                                    : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="annualPctReturn"
                        control={control}
                        rules={{ required: true, min: 0.01, max: maxAnnualPctReturn }}
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
                                    ? t(`error.field.${errors.annualPctReturn.type}`, { "ns": "common", "minValue": 0.01, "maxValue": maxAnnualPctReturn }) 
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