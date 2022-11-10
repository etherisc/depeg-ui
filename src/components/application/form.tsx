import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { InsuranceData } from '../../model/insurance_data';
import { formatCurrency } from '../../utils/numbers';

const formInputVariant = 'outlined';

export interface FormProperties {
    disabled: boolean;
    walletAddress: string;
    insurance: InsuranceData;
}

export default function Form(props: FormProperties) {
    const { t } = useTranslation('application');

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

    // coverage until
    const [coverageUntil, setCoverageUntil] = useState<moment.Moment | null>(moment().add(3, 'month'));
    const handleCoverageUntilChange = (date: moment.Moment | null) => {
        setCoverageUntil(date);
    };

    // terms accepted and validation
    let buyButtonDisabled = props.disabled;
    useEffect(() => {
        // TODO: enable buy button if all fields are set and checkbox ticked
        buyButtonDisabled = props.disabled;
    }, [props.disabled]);
    
    return (
        <Grid container maxWidth="md" spacing={4} mt={2} sx={{ p: 1, ml: 'auto', mr: 'auto' }} >
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="insuredWallet"
                    label={t('insuredWallet')}
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletAddressChange}
                    required
                />
                {/* TODO: check if address if externally owned */}
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    disabled={props.disabled}
                    variant={formInputVariant}
                    id="insuredAmount"
                    label={t('insuredAmount')}
                    type="text"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{props.insurance.usd1}</InputAdornment>,
                    }}
                    value={formatCurrency(insuredAmount)}
                    onChange={handleInsuredAmountChange}
                    onBlur={validateInsuredAmount}
                    helperText={insuredAmountError}
                    error={insuredAmountError != ""}
                />
                {/* TODO: check if amount is in range min/max */}
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
                    defaultValue=""
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                    }}
                />
                {/* TODO: preload with max days */}
                {/* TODO: update calender field and vice versa}
                {/* TODO: check in range min/max */}
            </Grid>
            <Grid item xs={6}>
                <DesktopDatePicker
                    disabled={props.disabled}
                    label={t('coverageDurationUntil')}
                    inputFormat="MM/DD/YYYY"
                    value={coverageUntil}
                    onChange={handleCoverageUntilChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    disablePast={true}
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
                    defaultValue=""
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{props.insurance.usd2}</InputAdornment>,
                    }}
                />
                {/* TODO: read only */}
                {/* TODO: grab premium from smart contract */}
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            defaultChecked={false}
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
                >
                    {t('button_buy')}
                </Button>
                {/* TODO: enable only if all form is valid */}
            </Grid>
        </Grid>
    );
}