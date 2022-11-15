import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { InsuranceApi } from '../../model/insurance_api';
import { formatCurrency } from '../../utils/numbers';
import CurrencyTextField from '../shared/currency_text_field';
import NumericTextField from '../shared/numeric_text_field';

const formInputVariant = 'outlined';

export interface InvestFormProperties {
    disabled: boolean;
    insurance: InsuranceApi;
    formReadyForInvest: (isFormReady: boolean) => void;
    invest: (investedAmount: number, minSumInsured: number, maxSumInsured: number, minDuration: number, maxDuration: number, annualPctReturn: number) => Promise<boolean>;
}

export default function InvestForm(props: InvestFormProperties) {
    const { t } = useTranslation('invest');
    const investProps = props.insurance.invest;

    // invested amount
    const [ investedAmount, setInvestedAmount ] = useState(investProps.maxInvestedAmount);
    const [ investedAmountValid, setInvestedAmountValid ] = useState(true);

    // minimum sum insured
    const [ minSumInsured, setMinSumInsured ] = useState(investProps.minSumInsured);
    const [ minSumInsuredValid, setMinSumInsuredValid ] = useState(true);

    function validateMinSumInsured(minSumInsured: number): string {
        if (minSumInsured > maxSumInsured) {
            return t('minSumInsuredMaxError');
        }

        return "";
    }

    // maximum sum insured
    const [ maxSumInsured, setMaxSumInsured ] = useState(investProps.maxSumInsured);
    const [ maxSumInsuredValid, setMaxSumInsuredValid ] = useState(true);

    // minimum coverage duration
    const [ minDuration, setMinDuration ] = useState(investProps.minCoverageDuration);
    const [ minDurationValid, setMinDurationValid ] = useState(true);

    function validateMinDuration() {
        if (minDuration > maxDuration) {
            return t('minDurationMaxError');
        }
        return "";
    }

    // maxmium coverage duration
    const [ maxDuration, setMaxDuration ] = useState(investProps.maxCoverageDuration);
    const [ maxDurationValid, setMaxDurationValid ] = useState(true);

    // annual percentage return
    const [ annualPctReturn, setAnnualPctReturn ] = useState(investProps.annualPctReturn);
    function handleAnnualPctReturnChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setAnnualPctReturn(0);
            return;
        }
        if (parseInt(val) > 100) {
            setAnnualPctReturn(1);
            return;
        }
        setAnnualPctReturn(parseInt(val) / 100);
    }

    const [ annualPctReturnError, setAnnualPctReturnError ] = useState("");
    function validateAnnualPctReturn() {
        if (annualPctReturn <= 0) {
            setAnnualPctReturnError(t('annualPctReturnMinError'));
            return false;
        }
        if (annualPctReturn > 1) {
            setAnnualPctReturnError(t('annualPctReturnMaxError', { pct: 100 }));
            return false;
        }
        if (annualPctReturn > investProps.maxAnnualPctReturn) {
            setAnnualPctReturnError(t('annualPctReturnMaxError', { pct: investProps.maxAnnualPctReturn * 100 }));
            return false;
        }
        setAnnualPctReturnError("");
        return true;
    }

    useEffect(() => {
        let valid = true;
        valid = investedAmountValid && valid;
        valid = minSumInsuredValid && valid;
        valid = maxSumInsuredValid && valid;
        valid = minDurationValid && valid;
        valid = maxDurationValid && valid;
        valid = validateAnnualPctReturn() && valid;
        setFormValid(valid);
    }, [investedAmountValid, minSumInsuredValid, maxSumInsuredValid, minDurationValid, maxDurationValid]);

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
            await props.invest(investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
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
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>,
                    }}
                    value={investedAmount}
                    currency={investProps.usd1}
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
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>
                    }}
                    value={minSumInsured}
                    currency={investProps.usd1}
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
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>
                    }}
                    value={maxSumInsured}
                    currency={investProps.usd1}
                    onChange={setMaxSumInsured}
                    minValue={investProps.minSumInsured}
                    maxValue={investProps.maxSumInsured}
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
                    onError={(errMsg) => setMaxDurationValid(errMsg === "")}
                    />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="annualPercentageReturn"
                    label={t('annualPercentageReturn')}
                    type="text"
                    value={annualPctReturn * 100}
                    onChange={handleAnnualPctReturnChange}
                    // onBlur={validateForm}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    helperText={annualPctReturnError}
                    error={annualPctReturnError != ""}
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