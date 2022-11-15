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
import { INPUT_VARIANT } from '../shared/numeric_text_field';

const formInputVariant = 'outlined';

export interface ApplicationFormProperties {
    disabled: boolean;
    walletAddress: string;
    insurance: InsuranceApi;
    formReadyForApply: (isFormReady: boolean) => void;
    applyForPolicy: (walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number) => Promise<boolean>;
}

export default function ApplicationForm(props: ApplicationFormProperties) {
    const { t } = useTranslation('application');

    // wallet address
    const [ walletAddress, setWalletAddress ] = useState(props.walletAddress);
    function handleWalletAddressChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setWalletAddress((x.target as HTMLInputElement).value);
    }
    const [ walletAddressError, setWalletAddressError ] = useState("");
    function validateWalletAddress() {
        if (walletAddress == "") {
            return t('insuredWalletRequired');
        }
        if (walletAddress.length != 42) {
            return t('insuredWalletInvalid');
        }
        // TODO check if wallet address is externally owned account
        return "";
    }

    const [ walletAddressValid, setWalletAddressValid ] = useState(false);
    function validateWalletAddressAndSetError() {
        const error = validateWalletAddress();
        setWalletAddressError(error);
        setWalletAddressValid(error == "");
    }

    useEffect(() => {
        setWalletAddress(props.walletAddress);
    }, [props.walletAddress]);

    // insured amount
    const [ insuredAmount, setInsuredAmount ] = useState(props.insurance.insuredAmountMax);
    const [ insuredAmountValid, setInsuredAmountValid ] = useState(true);

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
        valid = walletAddressValid && valid;
        valid = insuredAmountValid && valid;
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


    async function buy() {
        setApplicationInProgress(true);

        try {
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
                    variant={INPUT_VARIANT}
                    id="insuredWallet"
                    label={t('insuredWallet')}
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletAddressChange}
                    onBlur={validateWalletAddressAndSetError}
                    required
                    error={walletAddressError != ""}
                    helperText={walletAddressError}
                />
            </Grid>
            <Grid item xs={12}>
                <CurrencyTextField
                    required={true}
                    fullWidth={true}
                    disabled={props.disabled}
                    id="insuredAmount"
                    label={t('insuredAmount')}
                    inputProps={{
                        startAdornment: <InputAdornment position="start">{props.insurance.usd1}</InputAdornment>,
                    }}
                    value={insuredAmount}
                    currency={props.insurance.usd1}
                    onChange={setInsuredAmount}
                    minValue={props.insurance.insuredAmountMin}
                    maxValue={props.insurance.insuredAmountMax}
                    onError={(errMsg) => setInsuredAmountValid(errMsg === "")}
                />
                {/* TODO: preload with wallet amount */}
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    required
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="coverageDurationDays"
                    label={t('coverageDurationDays')}
                    type="text"
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                    }}
                    value={coverageDays}
                    onChange={handleCoverageDaysChange}
                    onBlur={validateFormAndCalculatePremium}
                    helperText={coverageDaysError}
                    error={coverageDaysError != ""}
                />
            </Grid>
            <Grid item xs={6}>
                <DesktopDatePicker
                    disabled={props.disabled}
                    label={t('coverageDurationUntil')}
                    inputFormat="MM/DD/YYYY"
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    disablePast={true}
                    value={coverageUntil}
                    onChange={handleCoverageUntilChange}
                    minDate={coverageUntilMin}
                    maxDate={coverageUntilMax}
                    />
                {/* TODO: mobile version */}
                </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="premiumAmount"
                    label={t('premiumAmount')}
                    type="text"
                    value={formatCurrency(premium)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{props.insurance.usd2}</InputAdornment>,
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
                    onClick={buy}
                >
                    {t('button_buy')}
                </Button>
                {waitForApply}
            </Grid>
        </Grid>
    );
}