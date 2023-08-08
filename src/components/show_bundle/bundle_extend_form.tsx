import { faArrowLeft, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, LinearProgress, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { BundleData } from "../../backend/bundle_data";
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS } from "../../utils/const";
import { INPUT_VARIANT } from "../../config/theme";
import { RootState } from "../../redux/store";
import TermsOfService from "../terms_of_service";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

interface BundleExtendFormProps {
    bundle: BundleData;
    minLifetime: number;
    maxLifetime: number;
    doExtend: (bundleId: number, extensionDuration: number) => Promise<boolean>;
    doCancel: () => void;
}

export type IFundFormValues = {
    extensionEndDate: Dayjs | null,
    termsAndConditions: boolean;
};

export default function BundleExtendForm(props: BundleExtendFormProps) {
    const { t } = useTranslation('bundles');

    const [ inProgress, setInProgress ] = useState(false);
    
    const defaultLifetime = 90;
    const currentEndDate = dayjs.unix(props.bundle.createdAt).add(BigNumber.from(props.bundle.lifetime).toNumber(), 's');
    const minExtensionDate = currentEndDate.add(props.minLifetime, 'days');
    const maxExtensionDate = currentEndDate.add(props.maxLifetime, 'days');
    console.log("currentEndDate", currentEndDate, "minExtensionDate", minExtensionDate, "maxExtensionDate", maxExtensionDate);
    
    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IFundFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            extensionEndDate: currentEndDate.add(defaultLifetime, 'days'),
            termsAndConditions: false,
        }
    });

    // const errors = useMemo(() => formState.errors, [formState]);
    
    const onSubmit: SubmitHandler<IFundFormValues> = async data => {
        console.log("submit clicked", data);
        setInProgress(true);

        try {
            const bundleId = props.bundle.id;
            const values = getValues();
            const extensionLifetime = values.extensionEndDate?.startOf('day').diff(currentEndDate.startOf('day'), 's') || 0;
            console.log("bundle extension", "bundleId", bundleId, "extensionLifetime", extensionLifetime);
            await props.doExtend(bundleId, extensionLifetime);
        } finally {
            setInProgress(false);
        }
    }

    const loadingBar = inProgress ? <LinearProgress /> : null;

    return (<>
        <Typography variant="h6" m={2} mt={4}>{t('title_extend')}</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Controller
                        name="extensionEndDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                            <DatePicker
                                {...field} 
                                label={t('extensionUntil')}
                                format="DD.MM.YYYY"
                                slotProps={{ 
                                    textField: { 
                                        variant: INPUT_VARIANT,
                                        fullWidth: true, 
                                    }
                                }}
                                disablePast={true}
                                minDate={minExtensionDate}
                                maxDate={maxExtensionDate}
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
                                    data-testid="t-and-c"
                                    />
                            } 
                            label={<TermsOfService />} />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                        <Button 
                            variant='outlined'
                            type="reset"
                            fullWidth
                            onClick={props.doCancel}
                            sx={{ p: 1, m: 1 }}
                            data-testid="cancel-button"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="fa" />
                            {t('action.cancel')}
                        </Button>
                        <Button 
                            variant='contained'
                            type="submit"
                            disabled={!formState.isValid}
                            fullWidth
                            sx={{ p: 1, m: 1 }}
                            data-testid="fund-button"
                            >
                                <FontAwesomeIcon icon={faMoneyBillTransfer} className="fa" />
                                {t('action.extend')}
                        </Button>
                    </Box>
                    {loadingBar}
                </Grid>
            </Grid>
        </form>
    </>);
}