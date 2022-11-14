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
    walletAddress: string;
    insurance: InsuranceApi;
    formReadyForApply: (isFormReady: boolean) => void;
    applyForPolicy: (walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number) => Promise<boolean>;
}

export default function InvestForm(props: InvestFormProperties) {
    const { t } = useTranslation('invest');

    // wallet address
    const [ walletAddress, setWalletAddress ] = useState(props.walletAddress);
    function handleWalletAddressChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setWalletAddress((x.target as HTMLInputElement).value);
    }

    useEffect(() => {
        setWalletAddress(props.walletAddress);
    }, [props.walletAddress]);

    // insured amount
    const [ insuredAmount, setInsuredAmount ] = useState(props.insurance.insuredAmountMax);
    function handleInsuredAmountChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            setInsuredAmount(0);
            return;
        }
        setInsuredAmount(parseInt(val.replaceAll(',', '')));
    }

    const [ insuredAmountError, setInsuredAmountError ] = useState("");
    function validateInsuredAmount() {
        if (insuredAmount < props.insurance.insuredAmountMin) {
            setInsuredAmountError(t('insuredAmountMinError', { amount: formatCurrency(props.insurance.insuredAmountMin), currency: props.insurance.usd1 }));
            return false;
        } 
        if ( insuredAmount > props.insurance.insuredAmountMax) {
            setInsuredAmountError(t('insuredAmountMaxError', { amount: formatCurrency(props.insurance.insuredAmountMax), currency: props.insurance.usd1 }));
            return false;
        }
        setInsuredAmountError("");
        return true;
    }

    // coverage period (days and date)

    // coverage days
    const [ coverageDays, setCoverageDays ] = useState(props.insurance.coverageDurationDaysMax);
    function handleCoverageDaysChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            val = "0";
        }
        setCoverageDays(parseInt(val));
        setCoverageUntil(moment().add(parseInt(val), 'days'));
    };

    // coverage until date
    const [ coverageUntil, setCoverageUntil ] = useState<moment.Moment | null>(moment().add(props.insurance.coverageDurationDaysMax, 'days'));
    const coverageUntilMin = moment().add(props.insurance.coverageDurationDaysMin, 'days');
    const coverageUntilMax = moment().add(props.insurance.coverageDurationDaysMax, 'days');
    function handleCoverageUntilChange(t: moment.Moment | null) {
        let date = t;
        if (date == null) {
            date = moment();
        }
        setCoverageUntil(date);
        setCoverageDays(date.startOf('day').diff(moment().startOf('day'), 'days'));
    };

    // validate coverageDays when coverageUntil changes
    useEffect(() => {
        if (coverageUntil != null) {
            validateFormAndCalculatePremium();
        }
    }, [coverageUntil]);  // eslint-disable-line react-hooks/exhaustive-deps

    const [ coverageDaysError, setCoverageDaysError ] = useState("");
    function validateCoverageDays() {
        if (coverageDays < props.insurance.coverageDurationDaysMin) {
            setCoverageDaysError(t('coverageDurationDaysMinError', { days: props.insurance.coverageDurationDaysMin }));
            return false;
        } 
        if (coverageDays > props.insurance.coverageDurationDaysMax) {
            setCoverageDaysError(t('coverageDurationDaysMaxError', { days: props.insurance.coverageDurationDaysMax }));
            return false;
        }
        setCoverageDaysError("");
        return true;
    }

    // premium
    const [ premium, setPremium ] = useState(0);

    async function validateFormAndCalculatePremium() {
        let valid = true;
        valid = validateInsuredAmount() && valid;
        valid = validateCoverageDays() && valid;
        if (valid) {
            setPremium(await props.insurance.calculatePremium(walletAddress, insuredAmount, coverageDays));
        }
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
        props.formReadyForApply(!isBuyButtonDisabled);
    }, [formValid, termsAccepted, props.disabled, applicationInProgress, props]);  


    async function invest() {
        setApplicationInProgress(true);

        try {
            // TODO: invest
            await props.applyForPolicy(walletAddress, insuredAmount, coverageDays, premium);
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
                    /* TODO: adornment currency */
                    // TODO: enable
                    // value={walletAddress}
                    // onChange={handleWalletAddressChange}
                    // onBlur={validateFormAndCalculatePremium}
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
                        /* TODO: adornment currency */
                        /* endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,*/
                    }}
                    // TODO: enable
                    // value={coverageDays}
                    // onChange={handleCoverageDaysChange}
                    // onBlur={validateFormAndCalculatePremium}
                    // TODO: error
                    // helperText={coverageDaysError}
                    // error={coverageDaysError != ""}
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
                        /* TODO: adornment currency */
                        /* endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,*/
                    }}
                    // TODO: enable
                    // value={coverageDays}
                    // onChange={handleCoverageDaysChange}
                    // onBlur={validateFormAndCalculatePremium}
                    // TODO: error
                    // helperText={coverageDaysError}
                    // error={coverageDaysError != ""}
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
                    // TODO: enable
                    // value={coverageDays}
                    // onChange={handleCoverageDaysChange}
                    // onBlur={validateFormAndCalculatePremium}
                    // TODO: error
                    // helperText={coverageDaysError}
                    // error={coverageDaysError != ""}
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
                    // TODO: enable
                    // value={coverageDays}
                    // onChange={handleCoverageDaysChange}
                    // onBlur={validateFormAndCalculatePremium}
                    // TODO: error
                    // helperText={coverageDaysError}
                    // error={coverageDaysError != ""}
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
                    value={formatCurrency(premium)}
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