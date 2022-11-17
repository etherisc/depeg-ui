import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
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
import { NoBundleFoundError } from '../../utils/error';
import { formatCurrency } from '../../utils/numbers';
import CurrencyTextField from '../shared/form/currency_text_field';
import NumericTextField, { INPUT_VARIANT } from '../shared/form/numeric_text_field';

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

    const [ walletAddressValid, setWalletAddressValid ] = useState(true);
    function validateWalletAddressAndSetError() {
        const error = validateWalletAddress();
        setWalletAddressError(error);
        setWalletAddressValid(error === "");
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
    const [ coverageDaysValid, setCoverageDaysValid ] = useState(true);

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

    // premium
    const [ premium, setPremium ] = useState(0);
    const [ premiumError, setPremiumError ] = useState("");

    useEffect(() => {
        async function calculatePremium() {
            console.log("Calculating premium...");
            try {
                setPremium(await props.insurance.calculatePremium(walletAddress, insuredAmount, coverageDays));
                setPremiumError("");
            } catch (e) {
                if (e instanceof NoBundleFoundError) {
                    console.log("No bundle found for this insurance.");
                    setPremiumError(t('error_no_matching_bundle_found'));
                } else {
                    console.log("Error calculating premium: ", e);
                }
                setFormValid(false);
                setPremium(0);
            }
        }

        console.log("Checking form validity...");

        let valid = true;
        valid = walletAddressValid && valid;
        valid = insuredAmountValid && valid;
        valid = coverageDaysValid && valid;
        if (valid) {
            console.log("Form is valid, calculating premium...");
            // TODO: calculate premium only once bundle data is loaded
            // TODO: recalculate premium on input onBlur not every keystroke (leads to intermediates error display while typing and data is incomplete invalid)
            // TODO: show spinner while calculating premium
            calculatePremium();
        } else {
            console.log("Form is invalid, not calculating premium...");
            setPremium(0);
        }
        setFormValid(valid);
    }, [walletAddressValid, insuredAmountValid, coverageDaysValid, props.insurance, walletAddress, insuredAmount, coverageDays, t]);

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
                <NumericTextField
                    fullWidth={true}
                    required={true}
                    disabled={props.disabled}
                    id="coverageDurationDays"
                    label={t('coverageDurationDays')}
                    inputProps={{
                        endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                    }}
                    value={coverageDays}
                    unit={t('days').toLowerCase()}
                    onChange={(days) => {
                        setCoverageDays(days);
                        setCoverageUntil(moment().add(days, 'days'));
                    }}
                    minValue={props.insurance.coverageDurationDaysMin}
                    maxValue={props.insurance.coverageDurationDaysMax}
                    onError={(errMsg) => setCoverageDaysValid(errMsg === "")}
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
                    error={premiumError != ""}
                    helperText={premiumError}
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