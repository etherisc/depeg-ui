import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const formInputVariant = 'outlined';

export interface FormProperties {

}

export default function Form(props: FormProperties) {
    const { t } = useTranslation('application');

    const [coverageUntil, setCoverageUntil] = useState<moment.Moment | null>(moment().add(3, 'month'));

    const handleCoverageUntilChange = (date: moment.Moment | null) => {
        setCoverageUntil(date);
    };
    
    return (
        <Grid container maxWidth="md" spacing={4} mt={2} sx={{ p: 1, ml: 'auto', mr: 'auto' }} >
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant={formInputVariant}
                    id="insuredWallet"
                    label={t('insuredWallet')}
                    type="text"
                    defaultValue=""
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant={formInputVariant}
                    id="insuredAmount"
                    label={t('insuredAmount')}
                    type="text"
                    defaultValue=""
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    variant={formInputVariant}
                    id="coverageDurationDays"
                    label={t('coverageDurationDays')}
                    type="text"
                    defaultValue=""
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <DesktopDatePicker
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
                    fullWidth
                    variant={formInputVariant}
                    id="premiumAmount"
                    label={t('premiumAmount')}
                    type="text"
                    defaultValue=""
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel 
                    control={
                        <Checkbox defaultChecked={false} />
                    } 
                    label={t('checkbox_t_and_c_label')} />
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant='contained'
                    fullWidth
                >
                    {t('button_buy')}
                </Button>
            </Grid>
        </Grid>
    );
}