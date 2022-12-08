import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { InsuranceApi } from '../../backend/insurance_api';
import { FormNumber } from '../../utils/types';
import CurrencyTextField from '../shared/form/currency_text_field';
import NumericTextField from '../shared/form/numeric_text_field';

const formInputVariant = 'outlined';

export interface InvestFormProperties {
    disabled: boolean;
    usd2: string;
    usd2Decimals: number;
    insurance: InsuranceApi;
    formReadyForInvest: (isFormReady: boolean) => void;
    invest: (investedAmount: number, minSumInsured: number, maxSumInsured: number, minDuration: number, maxDuration: number, annualPctReturn: number) => void;
}

export default function InvestForm(props: InvestFormProperties) {
    const { t } = useTranslation('invest');
    const investProps = props.insurance.invest;

    // invested amount
    const [ investedAmount, setInvestedAmount ] = useState(investProps.maxInvestedAmount as FormNumber);
    const [ investedAmountValid, setInvestedAmountValid ] = useState(true);

    // minimum sum insured
    const [ minSumInsured, setMinSumInsured ] = useState(investProps.minSumInsured as FormNumber);
    const [ minSumInsuredValid, setMinSumInsuredValid ] = useState(true);

    function validateMinSumInsured(minSumInsuredVal: number): string {
        if (maxSumInsured !== undefined && minSumInsuredVal > maxSumInsured) {
            return t('minSumInsuredMaxError');
        }

        return "";
    }

    // maximum sum insured
    const [ maxSumInsured, setMaxSumInsured ] = useState(investProps.maxSumInsured as FormNumber);
    const [ maxSumInsuredValid, setMaxSumInsuredValid ] = useState(true);

    function validateMaxSumInsured(maxSumInsuredVal: number): string {
        if (minSumInsured !== undefined && maxSumInsuredVal < minSumInsured) {
            return t('maxSumInsuredMinError');
        }

        return "";
    }

    // minimum coverage duration
    const [ minDuration, setMinDuration ] = useState(investProps.minCoverageDuration as FormNumber);
    const [ minDurationValid, setMinDurationValid ] = useState(true);

    function validateMinDuration(minDurationVal: number) {
        if (maxDuration !== undefined && minDurationVal > maxDuration) {
            return t('minDurationMaxError');
        }
        return "";
    }

    // maxmium coverage duration
    const [ maxDuration, setMaxDuration ] = useState(investProps.maxCoverageDuration as FormNumber);
    const [ maxDurationValid, setMaxDurationValid ] = useState(true);

    function validateMaxDuration(maxDurationVal: number): string {
        if (minDuration !== undefined && maxDurationVal < minDuration) {
            return t('maxDurationMinError');
        }
        return "";
    }

    // annual percentage return
    const [ annualPctReturn, setAnnualPctReturn ] = useState(investProps.annualPctReturn as FormNumber);
    const [ annualPctReturnValid, setAnnualPctReturnValid ] = useState(true);

    useEffect(() => {
        let valid = true;
        valid = investedAmountValid && valid;
        valid = minSumInsuredValid && valid;
        valid = maxSumInsuredValid && valid;
        valid = minDurationValid && valid;
        valid = maxDurationValid && valid;
        valid = annualPctReturnValid && valid;
        setFormValid(valid);
    }, [investedAmountValid, minSumInsuredValid, maxSumInsuredValid, minDurationValid, maxDurationValid, annualPctReturnValid]);

    // terms accepted and validation
    const [ termsAccepted, setTermsAccepted ] = useState(false);
    function handleTermsAcceptedChange(x: ChangeEvent<any>) {
        setTermsAccepted((x.target as HTMLInputElement).checked);
    }

    // invest button
    const [ formValid, setFormValid ] = useState(true);
    const [ investButtonDisabled, setInvestButtonDisabled ] = useState(true);
    const [ paymentInProgress, setPaymentInProgress ] = useState(false);

    useEffect(() => {
        let isBuyButtonDisabled = !formValid || !termsAccepted || props.disabled || paymentInProgress;
        setInvestButtonDisabled(isBuyButtonDisabled);
        props.formReadyForInvest(!isBuyButtonDisabled);
    }, [formValid, termsAccepted, props.disabled, paymentInProgress, props]);  


    async function invest() {
        setPaymentInProgress(true);

        try {
            await props.invest(investedAmount!, minSumInsured!, maxSumInsured!, minDuration!, maxDuration!, annualPctReturn!);
        } finally {
            setPaymentInProgress(false);
        }
    }

    const waitForPayment = paymentInProgress ? <LinearProgress /> : null;
    
    return (
        <Grid container maxWidth="md" spacing={4} mt={2} sx={{ p: 1, ml: 'auto', mr: 'auto' }} >
            <Grid item xs={12}>
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
                    />
            </Grid>
            <Grid item xs={6}>
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
                    />
            </Grid>
            <Grid item xs={6}>
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
                    />
            </Grid>
            <Grid item xs={6}>
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
                />
            </Grid>
            <Grid item xs={6}>
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
                    />
            </Grid>
            <Grid item xs={12}>
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
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            defaultChecked={false}
                            value={termsAccepted}
                            onChange={handleTermsAcceptedChange}
                            />
                    } 
                    disabled={props.disabled}
                    label={t('checkbox_t_and_c_label')} />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant='contained'
                    disabled={investButtonDisabled}
                    fullWidth
                    onClick={invest}
                >
                    {t('button_invest')}
                </Button>
                {waitForPayment}
            </Grid>
        </Grid>
    );
}