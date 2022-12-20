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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BundleData } from '../../backend/bundle_data';
import { ApplicationApi } from '../../backend/insurance_api';
import { BalanceTooSmallError, NoBundleFoundError } from '../../utils/error';
import { FormNumber } from '../../utils/types';
import CurrencyTextField from '../form/currency_text_field';
import NumericTextField from '../form/numeric_text_field';
import Premium from './premium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler, Controller, FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { loadDefaultErrorComponents } from 'next/dist/server/load-components';
import { INPUT_VARIANT } from '../../config/theme';
import { USD1_DECIMALS } from '../../utils/numbers';
import { parseUnits } from 'ethers/lib/utils';

export interface ApplicationFormProperties {
    formDisabled: boolean;
    walletAddress: string;
    usd1: string;
    usd1Decimals: number;
    usd2: string;
    usd2Decimals: number;
    applicationApi: ApplicationApi;
    bundles: Array<BundleData>;
    premiumTrxTextKey: string|undefined;
    formReadyForApply: (isFormReady: boolean) => void;
    applyForPolicy: (walletAddress: string, insuredAmount: number, coverageDuration: number, premium: number) => void;
}

export type IAplicationFormValues = {
    insuredWallet: string;
    insuredAmount: number;
    coverageDuration: number;
    coverageEndDate: string;
    premiumAmount: number;
    termsAndConditions: boolean;
};

export default function ApplicationForm(props: ApplicationFormProperties) {
    const { t } = useTranslation('application');

    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IAplicationFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            // checkbox: false,
            insuredWallet: "",
            insuredAmount: undefined,
            coverageDuration: props.applicationApi.coverageDurationDaysMax,
            coverageEndDate: moment().add(props.applicationApi.coverageDurationDaysMax, 'days').format("YYYY-MM-DD"),
            premiumAmount: undefined,
            termsAndConditions: false,
        }
    });
    
    const onSubmit: SubmitHandler<IAplicationFormValues> = data => {
        console.log("submit clicked", data);
        buy();
    }

    const errors = useMemo(() => formState.errors, [formState]);

    const [ premiumCalculationRequired, setPremiumCalculationRequired ] = useState(false);

    // useEffect(() => {
    //     console.log("formState", formState);
    //     console.log(formState.errors.insuredAmount);
    //     const values = getValues();
    //     const walletAddress = values.insuredWallet;
    //     const insuredAmount = values.insuredAmount * Math.pow(10, props.usd1Decimals);
    //     const coverageDays = values.coverageDuration;
    //     const premiumCalcReq = values.premiumCalculationRequired;
    //     console.log("formState", walletAddress, insuredAmount, coverageDays, premiumCalcReq, premiumCalculationRequired);
    //     // setPremiumCalculationRequired(false);
    //     setValue("premiumCalculationRequired", false);
    // }, [formState]);

    // handle changes in coverage duration / end date and update the other field accordingly
    const watchCoverageDuration = watch("coverageDuration");
    useEffect(() => {
        console.log("watchCoverageDuration", watchCoverageDuration);
        setValue("coverageEndDate", moment().startOf('day').add(watchCoverageDuration, 'days').format("YYYY-MM-DD"));
    }, [watchCoverageDuration]);

    const watchCoverageEndDate = watch("coverageEndDate");
    useEffect(() => {
        setValue("coverageDuration", moment(watchCoverageEndDate).startOf('day').diff(moment().startOf('day'), 'days')); 
    }, [watchCoverageEndDate]);

    // triggers premium calculation when any of the factors change and a calculation is required
    const watchPremiumFactors = watch(["insuredWallet", "insuredAmount", "coverageDuration"]);
    useEffect(() => {
        console.log("watchPremiumFactors", premiumCalculationRequired, watchPremiumFactors, errors);
        if (premiumCalculationRequired && !errors.insuredAmount && !errors.insuredWallet && !errors.coverageDuration) {
            calculatePremium();
        } else if (premiumCalculationRequired) {
            setValue("premiumAmount", 0);
        }
        setPremiumCalculationRequired(false);
    }, [watchPremiumFactors, errors]);

    // TODO: remove
    // // wallet address
    // const [ walletAddress, setWalletAddress ] = useState(props.walletAddress);
    // function handleWalletAddressChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     setWalletAddress((x.target as HTMLInputElement).value);
    // }
    // const [ walletAddressErrorKey, setWalletAddressErrorKey ] = useState("");
    // function validateWalletAddress() {
    //     if (walletAddress == "") {
    //         return t('insuredWalletRequired');
    //     }
    //     if (walletAddress.length != 42) {
    //         return t('insuredWalletInvalid');
    //     }
    //     return "";
    // }

    // const [ walletAddressValid, setWalletAddressValid ] = useState(true);
    // function validateWalletAddressAndSetError() {
    //     const error = validateWalletAddress();
    //     setWalletAddressErrorKey(error);
    //     setWalletAddressValid(error === "");
    // }

    useEffect(() => {
        // TODO: setWalletAddress(props.walletAddress);
        setValue("insuredWallet", props.walletAddress);
    }, [props.walletAddress]);

    // TODO: remove insured amount
    // const [ insuredAmount, setInsuredAmount ] = useState(undefined as FormNumber);
    // const [ insuredAmountValid, setInsuredAmountValid ] = useState(false);
    const [ insuredAmountMin, setInsuredAmountMin ] = useState(props.applicationApi.insuredAmountMin);
    const [ insuredAmountMax, setInsuredAmountMax ] = useState(props.applicationApi.insuredAmountMax);

    // coverage period (days and date)

    // TODO: remove coverage days
    // const [ coverageDays, setCoverageDays ] = useState(props.applicationApi.coverageDurationDaysMax  as FormNumber);
    // const [ coverageDaysValid, setCoverageDaysValid ] = useState(true);
    const [ coverageDaysMin, setCoverageDaysMin ] = useState(props.applicationApi.coverageDurationDaysMin);
    const [ coverageDaysMax, setCoverageDaysMax ] = useState(props.applicationApi.coverageDurationDaysMax);

    // TODO: remove coverage until date
    // const [ coverageUntil, setCoverageUntil ] = useState<moment.Moment | null>(moment().add(props.applicationApi.coverageDurationDaysMax, 'days'));
    const coverageUntilMin = moment().add(props.applicationApi.coverageDurationDaysMin, 'days');
    const coverageUntilMax = moment().add(props.applicationApi.coverageDurationDaysMax, 'days');

    // premium
    // const [ premium, setPremium ] = useState(undefined as FormNumber);
    const premium = useMemo(() => getValues("premiumAmount"), [getValues]);
    const [ premiumErrorKey, setPremiumErrorKey ] = useState("");
    const [ premiumCalculationInProgress, setPremiumCalculationInProgress ] = useState(false);
    const [ showAvailableBundles, setShowAvailableBundles ] = useState(false);


    // TODO: remove
    const isFormValid = useCallback(() => {
        // return walletAddressValid && insuredAmountValid && coverageDaysValid;
        return true;
    }, []); // }, [walletAddressValid, insuredAmountValid, coverageDaysValid]);

    // TODO: when premium cannot be calculated, show list of bundles

    
    // // TODO: remove terms accepted and validation
    // const [ termsAccepted, setTermsAccepted ] = useState(false);
    // function handleTermsAcceptedChange(x: ChangeEvent<any>) {
    //     setTermsAccepted((x.target as HTMLInputElement).checked);
    // }

    // buy button
    const [ buyButtonDisabled, setBuyButtonDisabled ] = useState(true);
    const [ applicationInProgress, setApplicationInProgress ] = useState(false);

    // TODO: remove
    // useEffect(() => {
    //     let isBuyButtonDisabled = !isFormValid() || !termsAccepted || props.disabled || applicationInProgress;
    //     setBuyButtonDisabled(isBuyButtonDisabled);
    //     props.formReadyForApply(!isBuyButtonDisabled);
    // }, [isFormValid, termsAccepted, props.disabled, applicationInProgress, props]);  

    //-------------------------------------------------------------------------
    // update min/max sum insured and coverage period when bundles are available
    useEffect(() => {
        if (props.bundles.length > 0) {
            let minSumInsured = Number.MAX_SAFE_INTEGER;
            let maxSumInsured = 0;
            let minCoverageSecs = Number.MAX_SAFE_INTEGER;
            let maxCoverageSecs = 0;
            for( let b of props.bundles) {
                if (b.minSumInsured < minSumInsured) {
                    minSumInsured = b.minSumInsured;
                }
                if (b.maxSumInsured > maxSumInsured) {
                    maxSumInsured = b.maxSumInsured;
                }
                if (b.minDuration < minCoverageSecs) {
                    minCoverageSecs = b.minDuration;
                }
                if (b.maxDuration > maxCoverageSecs) {
                    maxCoverageSecs = b.maxDuration;
                }
            }
            setInsuredAmountMin(minSumInsured / Math.pow(10, props.usd1Decimals));
            setInsuredAmountMax(maxSumInsured / Math.pow(10, props.usd1Decimals));
            const minCoverageDays = minCoverageSecs / 86400;
            const maxCoverageDays = maxCoverageSecs / 86400;
            setCoverageDaysMin(minCoverageDays);
            setCoverageDaysMax(maxCoverageDays);
            const coverageDays = maxCoverageDays < 30 ? maxCoverageDays : 30;
            setValue("coverageDuration", coverageDays);
            setValue("coverageEndDate", moment().add(coverageDays, 'days').format("YYYY-MM-DD"));
        }
    }, [props.bundles]);


    //-------------------------------------------------------------------------
    // calculate premium via onchain call
    const calculatePremium = useCallback( async () => {
        const values = getValues();
        console.log('calculatePremium', values, formState.errors);

        if (formState.touchedFields.insuredAmount === undefined) {
            console.log("amount not touched, not calculating premium...");
            return;
        }

        if (errors.coverageDuration !== undefined || errors.insuredWallet !== undefined || errors.insuredAmount !== undefined) {
            console.log("Form is invalid, not calculating premium...");
            return;
        }

        if (props.bundles.length == 0) {
            console.log("No bundles, not calculating premium...");
            setValue("premiumAmount", 0);
            return;
        }

        const walletAddress = values.insuredWallet;
        const insuredAmount = values.insuredAmount * Math.pow(10, props.usd1Decimals);
        const coverageDays = values.coverageDuration;

        console.log("Calculating premium...");
        try {
            setPremiumCalculationInProgress(true);
            setShowAvailableBundles(false);
            const premium = await props.applicationApi.calculatePremium(walletAddress, insuredAmount, coverageDays, props.bundles);
            setValue("premiumAmount", premium / Math.pow(10, props.usd1Decimals));
            setPremiumErrorKey("");
        } catch (e) {
            if (e instanceof NoBundleFoundError) {
                console.log("No bundle found for this insurance.");
                setPremiumErrorKey('error_no_matching_bundle_found');
                setShowAvailableBundles(true);
            } else if (e instanceof BalanceTooSmallError) {
                console.log("Wallet balance too low");
                setPremiumErrorKey('error_wallet_balance_too_low');
            } else {
                console.log("Error calculating premium: ", e);
            }
            setValue("premiumAmount", -1);
        } finally {
            setPremiumCalculationInProgress(false);
        }
    }, [formState, errors, props.bundles]);

    async function buy() {
        setApplicationInProgress(true);

        try {
            const values = getValues();
            const walletAddress = values.insuredWallet;
            const insuredAmountWei = values.insuredAmount * Math.pow(10, props.usd1Decimals);
            const coverageDays = values.coverageDuration;
            const premiumWei = values.premiumAmount * Math.pow(10, props.usd2Decimals);
            await props.applyForPolicy(walletAddress, insuredAmountWei, coverageDays, premiumWei);
        } finally {
            setApplicationInProgress(false);
        }
    }

    const loadingBar = applicationInProgress ? <LinearProgress /> : null;
    
    return (<>
        {/* FIXME: error texts */}
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={4} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    {/* TODO: remove this */}
                    {/* <TextField
                        fullWidth
                        required
                        disabled={props.disabled}
                        InputProps={{ readOnly: true }}
                        variant={INPUT_VARIANT}
                        id="insuredWallet"
                        label={t('insuredWallet')}
                        type="text"
                        value={walletAddress}
                        onChange={handleWalletAddressChange}
                        onBlur={validateWalletAddressAndSetError}
                        error={walletAddressErrorKey !== ""}
                        helperText={t(walletAddressErrorKey || 'insuredWalletHelper')}
                    /> */}
                    <Controller
                        name="insuredWallet"
                        control={control}
                        rules={{ required: true, maxLength: 42, minLength: 42, pattern: /^0x[a-fA-F0-9]{40}$/ }}
                        render={({ field }) => 
                            <TextField 
                                label={t('insuredWallet')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                onBlur={e => { field.onBlur(); setPremiumCalculationRequired(true); }}
                                error={errors.insuredWallet !== undefined}
                                helperText={errors.insuredWallet !== undefined ? errors.insuredWallet.type.toString() : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    {/* TODO: remove this */}
                    {/* <CurrencyTextField
                        required={true}
                        fullWidth={true}
                        disabled={props.disabled}
                        readOnly={premiumCalculationInProgress}
                        id="insuredAmount"
                        label={t('insuredAmount')}
                        inputProps={{
                            startAdornment: <InputAdornment position="start">{props.usd1}</InputAdornment>,
                        }}
                        value={insuredAmount}
                        currency={props.usd1}
                        currencyDecimals={props.usd1Decimals}
                        onChange={setInsuredAmount}
                        onBlur={calculatePremium}
                        minValue={insuredAmountMin}
                        maxValue={insuredAmountMax}
                        onError={(errMsg) => setInsuredAmountValid(errMsg === "")}
                    /> */}
                    <Controller
                        name="insuredAmount"
                        control={control}
                        rules={{ required: true, min: insuredAmountMin, max: insuredAmountMax, pattern: /^[0-9.,]+$/ }}
                        render={({ field }) => 
                            <TextField 
                                label={t('insuredAmount')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                onBlur={e => { field.onBlur(); setPremiumCalculationRequired(true); }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.usd1}</InputAdornment>,
                                }}
                                error={errors.insuredAmount !== undefined}
                                helperText={errors.insuredAmount !== undefined ? errors.insuredAmount.type.toString() : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* TODO: remove this */}
                    {/* <NumericTextField
                        fullWidth={true}
                        required={true}
                        disabled={props.disabled}
                        readOnly={premiumCalculationInProgress}
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
                        onBlur={calculatePremium}
                        minValue={coverageDaysMin}
                        maxValue={coverageDaysMax}
                        onError={(errMsg) => setCoverageDaysValid(errMsg === "")}
                    /> */}
                    <Controller
                        name="coverageDuration"
                        control={control}
                        rules={{ required: true, min: coverageDaysMin, max: coverageDaysMax, pattern: /^[0-9]+$/ }}
                        render={({ field }) => 
                            <TextField 
                                label={t('coverageDurationDays')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                onBlur={e => { field.onBlur(); setPremiumCalculationRequired(true); }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                                }}
                                error={errors.coverageDuration !== undefined}
                                helperText={errors.coverageDuration !== undefined ? errors.coverageDuration.type.toString() : ""}
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* TODO: remove this */}
                    {/* <DesktopDatePicker
                        disabled={props.disabled}
                        
                        readOnly={premiumCalculationInProgress}
                        label={t('coverageDurationUntil')}
                        inputFormat="DD.MM.YYYY"
                        renderInput={(params) => 
                            <TextField {...params} fullWidth variant={INPUT_VARIANT} />
                        }
                        disablePast={true}
                        value={coverageUntil}
                        onChange={handleCoverageUntilChange}
                        onAccept={calculatePremium}
                        minDate={coverageUntilMin}
                        maxDate={coverageUntilMax}
                        /> */}
                    <Controller
                        name="coverageEndDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                            <DesktopDatePicker
                                {...field} 
                                label={t('coverageDurationUntil')}
                                inputFormat="DD.MM.YYYY"
                                disabled={props.formDisabled}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params}
                                        fullWidth 
                                        variant={INPUT_VARIANT} 
                                        />
                                }
                                disablePast={true}
                                minDate={coverageUntilMin}
                                maxDate={coverageUntilMax}
                                />}
                        />
                        {/* TODO: mobile version */}
                </Grid>
                <Grid item xs={12}>
                    <Premium 
                        control={control}
                        disabled={props.formDisabled}
                        premium={premium}
                        premiumCurrency={props.usd2}
                        premiumCurrencyDecimals={props.usd2Decimals}
                        bundleCurrency={props.usd1}
                        bundleCurrencyDecimals={props.usd1Decimals}
                        error={t(premiumErrorKey, { currency: props.usd2 })}
                        transactionInProgress={(props.premiumTrxTextKey != "") || premiumCalculationInProgress}
                        textKey={props.premiumTrxTextKey || 'premium_calculation_in_progress'}
                        bundles={props.bundles}
                        showBundles={showAvailableBundles}
                        />
                </Grid>
                <Grid item xs={12}>
                    {/* <FormControlLabel 
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
                        type="submit"
                        disabled={!formState.isValid || premiumCalculationInProgress || props.formDisabled}
                        fullWidth
                        // onClick={buy}
                        sx={{ p: 1 }}
                    >
                        <FontAwesomeIcon icon={faShield} className="fa" />
                        {t('button_buy')}
                    </Button>
                    {loadingBar}
                </Grid>
            </Grid>
        </form>

        {/* <DevTool control={control} /> */}
    </>);
}
