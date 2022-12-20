import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { InsuranceApi } from '../../backend/insurance_api';
import { FormNumber } from '../../utils/types';
import CurrencyTextField from '../form/currency_text_field';
import NumericTextField from '../form/numeric_text_field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { INPUT_VARIANT } from '../../config/theme';

const formInputVariant = 'outlined';

export interface InvestFormProperties {
    formDisabled: boolean;
    usd2: string;
    usd2Decimals: number;
    insurance: InsuranceApi;
    formReadyForInvest: (isFormReady: boolean) => void;
    invest: (investedAmount: number, minSumInsured: number, maxSumInsured: number, minDuration: number, maxDuration: number, annualPctReturn: number) => void;
}

export type IInvestFormValues = {
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

    // TODO: remove
    // invested amount
    // const [ investedAmount, setInvestedAmount ] = useState(investProps.maxInvestedAmount as FormNumber);
    // const [ investedAmountValid, setInvestedAmountValid ] = useState(true);

    // // minimum sum insured
    // const [ minSumInsured, setMinSumInsured ] = useState(investProps.minSumInsured as FormNumber);
    // const [ minSumInsuredValid, setMinSumInsuredValid ] = useState(true);

    // function validateMinSumInsured(minSumInsuredVal: number): string {
    //     if (maxSumInsured !== undefined && minSumInsuredVal > maxSumInsured) {
    //         return t('minSumInsuredMaxError');
    //     }

    //     return "";
    // }

    // // maximum sum insured
    // const [ maxSumInsured, setMaxSumInsured ] = useState(investProps.maxSumInsured as FormNumber);
    // const [ maxSumInsuredValid, setMaxSumInsuredValid ] = useState(true);

    // function validateMaxSumInsured(maxSumInsuredVal: number): string {
    //     if (minSumInsured !== undefined && maxSumInsuredVal < minSumInsured) {
    //         return t('maxSumInsuredMinError');
    //     }

    //     return "";
    // }

    // // minimum coverage duration
    // const [ minDuration, setMinDuration ] = useState(investProps.minCoverageDuration as FormNumber);
    // const [ minDurationValid, setMinDurationValid ] = useState(true);

    // function validateMinDuration(minDurationVal: number) {
    //     if (maxDuration !== undefined && minDurationVal > maxDuration) {
    //         return t('minDurationMaxError');
    //     }
    //     return "";
    // }

    // // maxmium coverage duration
    // const [ maxDuration, setMaxDuration ] = useState(investProps.maxCoverageDuration as FormNumber);
    // const [ maxDurationValid, setMaxDurationValid ] = useState(true);

    // function validateMaxDuration(maxDurationVal: number): string {
    //     if (minDuration !== undefined && maxDurationVal < minDuration) {
    //         return t('maxDurationMinError');
    //     }
    //     return "";
    // }

    // // annual percentage return
    // const [ annualPctReturn, setAnnualPctReturn ] = useState(investProps.annualPctReturn as FormNumber);
    // const [ annualPctReturnValid, setAnnualPctReturnValid ] = useState(true);

    const { handleSubmit, control, formState, getValues, setValue, watch, trigger } = useForm<IInvestFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
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

    const watchInsuredAmountMin = watch("insuredAmountMin");
    useEffect(() => {
        trigger("insuredAmountMax");
    }, [watchInsuredAmountMin]);

    const watchInsuredAmountMax = watch("insuredAmountMax");
    useEffect(() => {
        trigger("insuredAmountMin");
    }, [watchInsuredAmountMax]);

    const watchCoverageDurationMin = watch("coverageDurationMin");
    useEffect(() => {
        trigger("coverageDurationMax");
    }, [watchCoverageDurationMin]);

    const watchCoverageDurationMax = watch("coverageDurationMax");
    useEffect(() => {
        trigger("coverageDurationMin");
    }, [watchCoverageDurationMax]);

    // TODO: remove this
    // useEffect(() => {
    //     let valid = true;
    //     valid = investedAmountValid && valid;
    //     valid = minSumInsuredValid && valid;
    //     valid = maxSumInsuredValid && valid;
    //     valid = minDurationValid && valid;
    //     valid = maxDurationValid && valid;
    //     valid = annualPctReturnValid && valid;
    //     setFormValid(valid);
    // }, [investedAmountValid, minSumInsuredValid, maxSumInsuredValid, minDurationValid, maxDurationValid, annualPctReturnValid]);

    // // terms accepted and validation
    // const [ termsAccepted, setTermsAccepted ] = useState(false);
    // function handleTermsAcceptedChange(x: ChangeEvent<any>) {
    //     setTermsAccepted((x.target as HTMLInputElement).checked);
    // }

    // invest button
    // const [ formValid, setFormValid ] = useState(true);
    // const [ investButtonDisabled, setInvestButtonDisabled ] = useState(true);
    const [ paymentInProgress, setPaymentInProgress ] = useState(false);

    // useEffect(() => {
    //     let isBuyButtonDisabled = !formValid || !termsAccepted || props.disabled || paymentInProgress;
    //     setInvestButtonDisabled(isBuyButtonDisabled);
    //     props.formReadyForInvest(!isBuyButtonDisabled);
    // }, [formValid, termsAccepted, props.disabled, paymentInProgress, props]);  


    const onSubmit: SubmitHandler<IInvestFormValues> = async data => {
        console.log("submit clicked", data);
        setPaymentInProgress(true);

        try {
            const values = getValues();
            const investedAmount = values.investedAmount * Math.pow(10, props.usd2Decimals);
            const minSumInsured = values.insuredAmountMin * Math.pow(10, props.usd2Decimals);
            const maxSumInsured = values.insuredAmountMax * Math.pow(10, props.usd2Decimals);
            const minDuration = values.coverageDurationMin;
            const maxDuration = values.coverageDurationMax;
            const annualPctReturn = values.annualPctReturn;
            await props.invest(investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
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
                    {/* TODO: remove
                    <CurrencyTextField
                        disabled={props.disabled}
                        required={true}
                        fullWidth={true}
                        id="investedAmount"
                        label={t('investedAmount')}
                        inputProps={{
                            startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>,
                        }}
                        value={investedAmount}
                        currency={props.usd2}
                        currencyDecimals={props.usd2Decimals}
                        onChange={setInvestedAmount}
                        minValue={investProps.minInvestedAmount}
                        maxValue={investProps.maxInvestedAmount}
                        onError={(errMsg) => setInvestedAmountValid(errMsg === "")}
                        /> */}
                    <Controller
                        name="investedAmount"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minInvestedAmount, 
                            max: maxInvestedAmount,
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
                                    ? t(`error.field.${errors.investedAmount.type}`, { "ns": "common", "minValue": `${props.usd2} ${minInvestedAmount}`, "maxValue": `${props.usd2} ${maxInvestedAmount}` }) 
                                    : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* TODO: remove this
                    <CurrencyTextField
                        fullWidth={true}
                        required={true}
                        disabled={props.disabled}
                        id="minSumInsured"
                        label={t('minSumInsured')}
                        inputProps={{
                            startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>
                        }}
                        value={minSumInsured}
                        currency={props.usd2}
                        currencyDecimals={props.usd2Decimals}
                        onChange={setMinSumInsured}
                        minValue={investProps.minSumInsured}
                        maxValue={investProps.maxSumInsured}
                        extraValidation={validateMinSumInsured}
                        onError={(errMsg) => setMinSumInsuredValid(errMsg === "")}
                        /> */}
                    <Controller
                        name="insuredAmountMin"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minSumInsured, 
                            max: maxSumInsured,
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
                                    ? t(`error.field.${errors.insuredAmountMin.type}`, { "ns": "common", "minValue": `${props.usd2} ${minSumInsured}`, "maxValue": `${props.usd2} ${maxSumInsured}` }) 
                                    : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* TODO: remove this
                    <CurrencyTextField
                        fullWidth={true}
                        required={true}
                        disabled={props.disabled}
                        id="maxSumInsured"
                        label={t('maxSumInsured')}
                        inputProps={{
                            startAdornment: <InputAdornment position="start">{props.usd2}</InputAdornment>
                        }}
                        value={maxSumInsured}
                        currency={props.usd2}
                        currencyDecimals={props.usd2Decimals}
                        onChange={setMaxSumInsured}
                        minValue={investProps.minSumInsured}
                        maxValue={investProps.maxSumInsured}
                        extraValidation={validateMaxSumInsured}
                        onError={(errMsg) => setMaxSumInsuredValid(errMsg === "")}
                        /> */}
                    <Controller
                        name="insuredAmountMax"
                        control={control}
                        rules={{ 
                            required: true, 
                            min: minSumInsured, 
                            max: maxSumInsured,
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
                                    ? t(`error.field.${errors.insuredAmountMax.type}`, { "ns": "common", "minValue": `${props.usd2} ${minSumInsured}`, "maxValue": `${props.usd2} ${maxSumInsured}` }) 
                                    : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* // TODO: remove this
                    <NumericTextField
                        fullWidth={true}
                        required={true}
                        disabled={props.disabled}
                        id="minDuration"
                        label={t('minDuration')}
                        inputProps={{
                            endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                        }}
                        value={minDuration}
                        unit={t('days').toLowerCase()}
                        onChange={setMinDuration}
                        minValue={investProps.minCoverageDuration}
                        maxValue={investProps.maxCoverageDuration}
                        extraValidation={validateMinDuration}
                        onError={(errMsg) => setMinDurationValid(errMsg === "")}
                    /> */}
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
                    {/* // TODO: remove this
                    <NumericTextField
                        fullWidth= {true}
                        required={true}
                        disabled={props.disabled}
                        id="maxDuration"
                        label={t('maxDuration')}
                        inputProps={{
                            endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                        }}
                        value={maxDuration}
                        unit={t('days').toLowerCase()}
                        onChange={setMaxDuration}
                        minValue={investProps.minCoverageDuration}
                        maxValue={investProps.maxCoverageDuration}
                        extraValidation={validateMaxDuration}
                        onError={(errMsg) => setMaxDurationValid(errMsg === "")}
                        /> */}
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
                    {/* // TODO: remove this
                    <NumericTextField
                        required={true}
                        fullWidth={true}
                        disabled={props.disabled}
                        id="annualPercentageReturn"
                        label={t('annualPercentageReturn')}
                        value={annualPctReturn}
                        unit="%"
                        onChange={setAnnualPctReturn}
                        inputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        minValue={0.01}
                        maxValue={investProps.maxAnnualPctReturn}
                        onError={(errMsg) => setAnnualPctReturnValid(errMsg === "")}
                    /> */}
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
                    {// TODO: remove this
                    /* <FormControlLabel 
                        control={
                            <Checkbox 
                                defaultChecked={false}
                                value={termsAccepted}
                                onChange={handleTermsAcceptedChange}
                                />
                        } 
                        disabled={props.disabled}
                        label={t('checkbox_t_and_c_label')} /> */}
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
                            label={t('checkbox_t_and_c_label')} />}
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