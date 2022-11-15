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
    function handleInvestedAmountChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setInvestedAmount(0);
            return;
        }
        setInvestedAmount(parseInt(val.replaceAll(',', '')));
    }

    const [ investedAmountError, setInvestedAmountError ] = useState("");
    function validateInvestedAmount() {
        if (investedAmount < investProps.minInvestedAmount) {
            setInvestedAmountError(t('investedAmountMinError', { amount: formatCurrency(investProps.minInvestedAmount), currency: investProps.usd1 }));
            return false;
        } 
        if ( investedAmount > investProps.maxInvestedAmount) {
            setInvestedAmountError(t('investedAmountMaxError', { amount: formatCurrency(investProps.maxInvestedAmount), currency: investProps.usd1 }));
            return false;
        }
        setInvestedAmountError("");
        return true;
    }

    // minimum sum insured
    const [ minSumInsured, setMinSumInsured ] = useState(investProps.minSumInsured);
    function handleMinSumInsuredChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setMinSumInsured(0);
            return;
        }
        setMinSumInsured(parseInt(val.replaceAll(',', '')));
    }
    const [ minSumInsuredError, setMinSumInsuredError ] = useState("");

    function validateMinSumInsured() {
        if (minSumInsured < investProps.minSumInsured) {
            setMinSumInsuredError(t('minSumInsuredMinError', { amount: formatCurrency(investProps.minSumInsured), currency: investProps.usd1 }));
            return false;
        }

        if (minSumInsured > maxSumInsured) {
            setMinSumInsuredError(t('minSumInsuredMaxError'));
            return false;
        }
        // TODO if same show note instead of error
        setMinSumInsuredError("");
        return true;
    }

    // maximum sum insured
    const [ maxSumInsured, setMaxSumInsured ] = useState(investProps.maxSumInsured);
    function handleMaxSumInsuredChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setMaxSumInsured(0);
            return;
        }
        setMaxSumInsured(parseInt(val.replaceAll(',', '')));
    }
    const [ maxSumInsuredError, setMaxSumInsuredError ] = useState("");

    function validateMaxSumInsured() {
        if (maxSumInsured > investProps.maxSumInsured) {
            setMaxSumInsuredError(t('maxSumInsuredMaxError', { amount: formatCurrency(investProps.maxSumInsured), currency: investProps.usd1 }));
            return false;
        }
        // TODO if same show note instead of error
        setMaxSumInsuredError("");
        return true;
    }

    // minimum coverage duration
    const [ minDuration, setMinDuration ] = useState(investProps.minCoverageDuration);
    function handleMinDurationChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setMinDuration(0);
            return;
        }
        setMinDuration(parseInt(val));
    }

    const [ minDurationError, setMinDurationError ] = useState("");
    function validateMinDuration() {
        if (minDuration < investProps.minCoverageDuration) {
            setMinDurationError(t('minDurationMinError', { duration: investProps.minCoverageDuration }));
            return false;
        }
        if (minDuration > maxDuration) {
            setMinDurationError(t('minDurationMaxError'));
            return false;
        }
        setMinDurationError("");
        return true;
    }

    // maxmium coverage duration
    const [ maxDuration, setMaxDuration ] = useState(investProps.maxCoverageDuration);
    function handleMaxDurationChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setMaxDuration(0);
            return;
        }
        setMaxDuration(parseInt(val));
    }

    const [ maxDurationError, setMaxDurationError ] = useState("");
    function validateMaxDuration() {
        if (maxDuration > investProps.maxCoverageDuration) {
            setMaxDurationError(t('maxDurationMaxError', { duration: investProps.maxCoverageDuration }));
            return false;
        }
        setMaxDurationError("");
        return true;
    }

    async function validateForm() {
        let valid = true;
        valid = validateInvestedAmount() && valid;
        valid = validateMinSumInsured() && valid;
        valid = validateMaxSumInsured() && valid;
        valid = validateMinDuration() && valid;
        valid = validateMaxDuration() && valid;
        setFormValid(valid);
    }

    // terms accepted and validation
    const [ termsAccepted, setTermsAccepted ] = useState(false);
    function handleTermsAcceptedChange(x: ChangeEvent<any>) {
        setTermsAccepted((x.target as HTMLInputElement).checked);
    }

    // buy button
    const [ formValid, setFormValid ] = useState(true);
    const [ buyButtonDisabled, setBuyButtonDisabled ] = useState(true);
    const [ applicationInProgress, setApplicationInProgress ] = useState(false);

    useEffect(() => {
        let isBuyButtonDisabled = !formValid || !termsAccepted || props.disabled || applicationInProgress;
        setBuyButtonDisabled(isBuyButtonDisabled);
        props.formReadyForInvest(!isBuyButtonDisabled);
    }, [formValid, termsAccepted, props.disabled, applicationInProgress, props]);  


    async function invest() {
        setApplicationInProgress(true);

        try {
            // TODO: invest
            
        } finally {
            setApplicationInProgress(false);
        }
    }

    const waitForApply = applicationInProgress ? <LinearProgress /> : null;
    
    return (
        <Grid container maxWidth="md" spacing={4} mt={2} sx={{ p: 1, ml: 'auto', mr: 'auto' }} >
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="investedAmount"
                    label={t('investedAmount')}
                    type="text"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>,
                    }}
                    value={formatCurrency(investedAmount)}
                    onChange={handleInvestedAmountChange}
                    onBlur={validateForm}
                    helperText={investedAmountError}
                    error={investedAmountError != ""}
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    required
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="minSumInsured"
                    label={t('minSumInsured')}
                    type="text"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>
                    }}
                    value={formatCurrency(minSumInsured)}
                    onChange={handleMinSumInsuredChange}
                    onBlur={validateForm}
                    helperText={minSumInsuredError}
                    error={minSumInsuredError != ""}
                    />
            </Grid>
            <Grid item xs={6}>
            <TextField
                    fullWidth
                    required
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="maxSumInsured"
                    label={t('maxSumInsured')}
                    type="text"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{investProps.usd1}</InputAdornment>
                    }}
                    value={formatCurrency(maxSumInsured)}
                    onChange={handleMaxSumInsuredChange}
                    onBlur={validateForm}
                    helperText={maxSumInsuredError}
                    error={maxSumInsuredError != ""}
                    />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    required
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="minDuration"
                    label={t('minDuration')}
                    type="text"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                    }}
                    value={minDuration}
                    onChange={handleMinDurationChange}
                    onBlur={validateForm}
                    helperText={minDurationError}
                    error={minDurationError != ""}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    required
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="maxDuration"
                    label={t('maxDuration')}
                    type="text"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                    }}
                    value={maxDuration}
                    onChange={handleMaxDurationChange}
                    onBlur={validateForm}
                    helperText={maxDurationError}
                    error={maxDurationError != ""}
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
                    // TODO: validation
                    value={0}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        readOnly: true,
                    }}
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
                    disabled={buyButtonDisabled}
                    fullWidth
                    onClick={invest}
                >
                    {t('button_invest')}
                </Button>
                {waitForApply}
            </Grid>
        </Grid>
    );
}