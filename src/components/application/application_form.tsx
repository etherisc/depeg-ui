import { faCircleInfo, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { BigNumber, ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationApi } from '../../backend/backend_api';
import { BundleData, MAX_BUNDLE } from '../../backend/bundle_data';
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS } from '../../utils/const';
import { INPUT_VARIANT } from '../../config/theme';
import { clearPremium, setApplicableBundleIds, setPremium, setPremiumCalculationInProgress, setPremiumErrorKey } from '../../redux/slices/application';
import { RootState } from '../../redux/store';
import { filterApplicableBundles } from '../../utils/bundles';
import TermsOfService from '../terms_of_service';
import { AvailableBundleList } from './available_bundle_list';
import PayoutExample from './payout_example';
import Premium from './premium';
import WithTooltip from "../with_tooltip";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { formatCurrency, formatCurrencyBN } from "../../utils/numbers";

export interface ApplicationFormProperties {
    formDisabled: boolean;
    connectedWalletAddress: string;
    usd1: string;
    usd1Decimals: number;
    usd2: string;
    usd2Decimals: number;
    applicationApi: ApplicationApi;
    premiumTrxTextKey: string|undefined;
    hasBalance: (walletAddress: string, amount: BigNumber) => Promise<boolean>;
    readyToSubmit: (isFormReady: boolean) => void;
    applyForPolicy: (walletAddress: string, protectedAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number, gasless: boolean) => void;
}

export type IAplicationFormValues = {
    insuredWallet: string;
    protectedAmount: string;
    coverageDuration: string;
    coverageEndDate: Dayjs | null;
    gasless: boolean;
    termsAndConditions: boolean;
};

export default function ApplicationForm(props: ApplicationFormProperties) {
    const { t } = useTranslation('application');
    const dispatch = useDispatch();
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const bundles = useSelector((state: RootState) => state.application.bundles);
    const isLoadingBundles = useSelector((state: RootState) => state.application.isLoadingBundles);
    const applicableBundleIds = useSelector((state: RootState) => state.application.applicableBundleIds);
    const selectedBundleId = useSelector((state: RootState) => state.application.selectedBundleId);
    const premium = useSelector((state: RootState) => state.application.premium);
    const premiumErrorKey = useSelector((state: RootState) => state.application.premiumErrorKey);
    const premiumCalculationInProgress = useSelector((state: RootState) => state.application.premiumCalculationInProgress);
    const walletUsd1Balance = useSelector((state: RootState) => state.account.balanceUsd1);

    const maxGasPrice = process.env.NEXT_PUBLIC_MAX_GAS_PRICE_LIMIT ? parseInt(process.env.NEXT_PUBLIC_MAX_GAS_PRICE_LIMIT) : 30;

    const hasBalance = props.hasBalance;

    const [ protectedAmountMin, setProtectedAmountMin ] = useState(props.applicationApi.protectedAmountMin.toNumber());
    const [ protectedAmountMax, setProtectedAmountMax ] = useState(props.applicationApi.protectedAmountMax.toNumber());

    // coverage period (days and date)
    const [ coverageDaysMin, setCoverageDaysMin ] = useState(props.applicationApi.coverageDurationDaysMin);
    const [ coverageDaysMax, setCoverageDaysMax ] = useState(props.applicationApi.coverageDurationDaysMax);
    const [ coverageUntilMin, setCoverageUntilMin ] = useState(dayjs().add(props.applicationApi.coverageDurationDaysMin, 'days'));
    const [ coverageUntilMax, setCoverageUntilMax ] = useState(dayjs().add(props.applicationApi.coverageDurationDaysMax, 'days'));
    
    const { handleSubmit, control, formState, getValues, setValue, watch } = useForm<IAplicationFormValues>({ 
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            insuredWallet: "",
            protectedAmount: undefined,
            coverageDuration: props.applicationApi.coverageDurationDaysMax.toString(),
            coverageEndDate: dayjs().add(props.applicationApi.coverageDurationDaysMax, 'days'),
            termsAndConditions: false,
            gasless: false, 
        }
    });

    const watchProtectedAmount = watch("protectedAmount");

    // update wallet address when it changes
    useEffect(() => {
        setValue("insuredWallet", props.connectedWalletAddress);
    }, [props.connectedWalletAddress, setValue]);

    const errors = useMemo(() => formState.errors, [formState]);

    const validateFormState = useCallback(() => {
        // console.log("validateFormState");
        if (formState.touchedFields.protectedAmount === undefined) {
            console.log("amount not touched, not calculating premium...");
            return false;
        }

        if (errors.coverageDuration !== undefined || errors.insuredWallet !== undefined || errors.protectedAmount !== undefined) {
            console.log("Form is invalid, not calculating premium...");
            return false;
        }

        if (bundles.length == 0) {
            console.log("No bundles, not calculating premium...");
            return false;
        }
        return true;
    }, [errors, formState.touchedFields.protectedAmount, bundles.length]);

    const getPremiumParameters = useCallback(() => {
        // console.log("getPremiumParameters");
        const values = getValues();
        const insuredWallet = values.insuredWallet;
        const protectedAmount = parseUnits(values.protectedAmount ?? "0", props.usd1Decimals);
        const coverageSeconds = parseInt(values.coverageDuration) * 24 * 60 * 60;
        return { insuredWallet, protectedAmount, coverageSeconds };
    }, [getValues, props.usd1Decimals]);

    const calculatePremium = useCallback(async () => {
        // console.log("calculatePremium");
        if ( ! validateFormState()) {
            console.log("form not valid, not calculating premium");
            dispatch(setApplicableBundleIds(undefined));
            dispatch(clearPremium());
            return;
        }
        
        dispatch(setPremiumCalculationInProgress(true));
        dispatch(clearPremium());
        try {
            const { insuredWallet, protectedAmount, coverageSeconds } = getPremiumParameters();
            // filter bundles matching application
            const fbid = filterApplicableBundles(bundles, protectedAmount, coverageSeconds).map(b => b.id);
            dispatch(setApplicableBundleIds(fbid));
            console.log("fbid", fbid);

            if (fbid.length == 0) {
                return;
            }
            
            const remainingBundles = bundles.filter((b: BundleData) => fbid.includes(b.id));
            console.log("remainingBundles", remainingBundles);

            // select the bundle with the lowest APR
            const bestBundle = remainingBundles.reduce((prev: BundleData, current: BundleData) => prev.apr < current.apr ? prev : current, MAX_BUNDLE);
            console.log("bestBundle", bestBundle);

            // calculate premium
            const calculatedPremium = await props.applicationApi.calculatePremium(insuredWallet, protectedAmount, coverageSeconds, bestBundle);
            console.log("premium", calculatedPremium.toString());
            dispatch(setPremium([bestBundle.id, calculatedPremium.toString()]));

            // and finally check if the wallet has enough balance
            const walletBalanceSufficient = await hasBalance(insuredWallet, calculatedPremium);
            console.log("walletBalanceSufficient", calculatedPremium, walletBalanceSufficient);
            if (! walletBalanceSufficient) {
                dispatch(setPremiumErrorKey("error_wallet_balance_too_low"));
            } else {
                dispatch(setPremiumErrorKey(undefined));
            }
        } catch (e) {
            console.log(e);
            dispatch(setPremiumErrorKey("error_calculating_premium"));
        } finally {
            dispatch(setPremiumCalculationInProgress(false));
        }
    }, [validateFormState, dispatch, getPremiumParameters, bundles, props.applicationApi, hasBalance]);

    //-------------------------------------------------------------------------
    // update min/max sum insured and coverage period when bundles are available
    useEffect(() => {
        if (bundles.length > 0) {
            let minSumInsured = BigNumber.from(Number.MAX_SAFE_INTEGER - 1);
            let maxSumInsured = BigNumber.from(0);
            let minCoverageSecs = Number.MAX_SAFE_INTEGER;
            let maxCoverageSecs = 0;
            for( let b of bundles) {
                const bminSumInsured = BigNumber.from(b.minProtectedAmount);
                const bmaxSumInsured = BigNumber.from(b.maxProtectedAmount);

                if (bminSumInsured.lt(minSumInsured)) {
                    minSumInsured = bminSumInsured;
                }
                if (bmaxSumInsured.gt(maxSumInsured)) {
                    maxSumInsured = bmaxSumInsured;
                }
                if (b.minDuration < minCoverageSecs) {
                    minCoverageSecs = b.minDuration;
                }
                if (b.maxDuration > maxCoverageSecs) {
                    maxCoverageSecs = b.maxDuration;
                }
            }
            setProtectedAmountMin(parseInt(formatUnits(minSumInsured, props.usd1Decimals)));
            setProtectedAmountMax(parseInt(formatUnits(maxSumInsured, props.usd1Decimals)));
            const minCoverageDays = minCoverageSecs / 86400;
            const maxCoverageDays = maxCoverageSecs / 86400;
            setCoverageDaysMin(minCoverageDays);
            setCoverageDaysMax(maxCoverageDays);
            const coverageDays = maxCoverageDays < 30 ? maxCoverageDays : 30;
            setValue("coverageDuration", coverageDays.toString());
            setValue("coverageEndDate", dayjs().add(coverageDays, 'days'));
            setCoverageUntilMin(dayjs().add(minCoverageDays, 'days'));
            setCoverageUntilMax(dayjs().add(maxCoverageDays, 'days'));

        }
    }, [bundles, props.usd1Decimals, setValue]);

    const switchBundle = useCallback(async (bundle: BundleData) => {
        const { insuredWallet, protectedAmount, coverageSeconds } = getPremiumParameters();
        const premium = await props.applicationApi.calculatePremium(insuredWallet, protectedAmount, coverageSeconds, bundle);
        console.log("premium", premium.toString());
        dispatch(setPremium([bundle.id, premium.toString()]));    
    }, [getPremiumParameters, props.applicationApi, dispatch]);

    const [ applicationInProgress, setApplicationInProgress ] = useState(false);

    const onSubmit: SubmitHandler<IAplicationFormValues> = async data => {
        console.log("submit clicked", data);
        setApplicationInProgress(true);

        try {
            const values = getValues();
            const walletAddress = values.insuredWallet;
            const protectedAmountWei = parseUnits(values.protectedAmount, props.usd1Decimals);
            const coverageSeconds = parseInt(values.coverageDuration) * 24 * 60 * 60;
            const gasless = values.gasless;
            props.applyForPolicy(walletAddress, protectedAmountWei, coverageSeconds, BigNumber.from(premium), selectedBundleId!, gasless);
        } finally {
            setApplicationInProgress(false);
        }
    }

    const readyToSubmit = formState.isValid && ! premiumCalculationInProgress && ! props.formDisabled && selectedBundleId !== undefined && premiumErrorKey === undefined;
    props.readyToSubmit(readyToSubmit);
    
    const loadingBar = applicationInProgress ? <LinearProgress /> : null;
    const walletUsd1BalanceBN = BigNumber.from(walletUsd1Balance.amount);

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'lg'}} spacing={4} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Controller
                        name="insuredWallet"
                        control={control}
                        rules={{ 
                            required: true, 
                            maxLength: 42, 
                            minLength: 42, 
                            pattern: /^0x[a-fA-F0-9]{40}$/,
                            validate: {
                                isAddress: (value) => {
                                    try {
                                        return ethers.utils.isAddress(value);
                                    } catch (e) {
                                        return false;
                                    }
                                }
                            }
                        }}
                        render={({ field }) => 
                            <TextField 
                                label={t('insuredWallet')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                onBlur={async (e) => { 
                                    field.onBlur();
                                    await calculatePremium();
                                }}
                                error={errors.insuredWallet !== undefined}
                                helperText={errors.insuredWallet !== undefined 
                                    ? ( 
                                        errors.insuredWallet.type == 'pattern' 
                                            ? t(`error.field.walletType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.insuredWallet.type}`, { "ns": "common", "minLength": 42, "maxLength": 42}) 
                                    )
                                    : t('insuredWalletHelper')}
                                data-testid="insuredWallet"
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="protectedAmount"
                        control={control}
                        rules={{ required: true, min: protectedAmountMin, max: protectedAmountMax, pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS  }}
                        render={({ field }) => 
                            <TextField 
                                label={t('protectedAmount')}
                                fullWidth
                                disabled={props.formDisabled}
                                variant={INPUT_VARIANT}
                                {...field} 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{props.usd1}</InputAdornment>,
                                }}
                                onBlur={async (e) => { 
                                    field.onBlur();
                                    await calculatePremium();
                                }}
                                error={errors.protectedAmount !== undefined}
                                helperText={errors.protectedAmount !== undefined 
                                    ? ( errors.protectedAmount.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.protectedAmount.type}`, { "ns": "common", "minValue": `${props.usd1} ${protectedAmountMin}`, "maxValue": `${props.usd1} ${protectedAmountMax}` })
                                    ) : t('protected_amount_helper', { currency: walletUsd1Balance?.currency, balance: formatCurrencyBN(walletUsd1BalanceBN, walletUsd1Balance.decimals)})
                                }
                                data-testid="protected-amount"
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
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
                                onBlur={async (e) => { 
                                    field.onBlur(); 
                                    setValue("coverageEndDate", dayjs().startOf('day').add(parseInt(e.target.value), 'days'));
                                    await calculatePremium();
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{t('days')}</InputAdornment>,
                                }}
                                error={errors.coverageDuration !== undefined}
                                helperText={errors.coverageDuration !== undefined 
                                    ? ( errors.coverageDuration.type == 'pattern' 
                                            ? t(`error.field.numberType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.coverageDuration.type}`, { "ns": "common", "minValue": coverageDaysMin, "maxValue": coverageDaysMax }) 
                                    ) : ""}
                                data-testid="coverageDuration"
                                />}
                        />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="coverageEndDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => 
                            <DatePicker
                                {...field} 
                                label={t('coverageDurationUntil')}
                                format="DD.MM.YYYY"
                                disabled={props.formDisabled}
                                slotProps={{ 
                                    textField: { 
                                        variant: INPUT_VARIANT,
                                        fullWidth: true, 
                                    }
                                }}
                                onAccept={async (date) => {
                                    setValue("coverageDuration", dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'days').toString()); 
                                    await calculatePremium();
                                }}
                                disablePast={true}
                                minDate={coverageUntilMin}
                                maxDate={coverageUntilMax}
                                />}
                        />
                </Grid>
                <Grid item xs={12}>
                    <PayoutExample 
                        protectedAmount={errors.protectedAmount !== undefined ? undefined : watchProtectedAmount}
                        currency={props.usd1}
                        currency2={props.usd2}
                        />
                </Grid>
                <Grid item xs={12}>
                    <AvailableBundleList 
                        formDisabled={props.formDisabled}
                        isWalletConnected={isConnected}
                        currency={props.usd1}
                        currencyDecimals={props.usd1Decimals}
                        bundles={bundles}
                        bundlesLoading={isLoadingBundles} 
                        applicableBundleIds={applicableBundleIds}
                        selectedBundleId={selectedBundleId}
                        onBundleSelected={(bundle: BundleData) => switchBundle(bundle) }
                        />
                </Grid>
                <Grid item xs={12}>
                    <Premium 
                        control={control}
                        disabled={props.formDisabled}
                        premiumAmount={premium}
                        premiumCurrency={props.usd2}
                        premiumCurrencyDecimals={props.usd2Decimals}
                        helperText={t(premiumErrorKey ?? "", { currency: props.usd2 })}
                        helperTextIsError={premiumErrorKey !== undefined}
                        transactionInProgress={premiumCalculationInProgress}
                        trxTextKey={props.premiumTrxTextKey || 'premium_calculation_in_progress'}
                        />
                </Grid>
                <Grid item xs={12} >
                    { process.env.NEXT_PUBLIC_FEATURE_GASLESS_TRANSACTION === 'true' &&
                        <Controller
                            name="gasless"
                            control={control}
                            render={({ field }) => 
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            defaultChecked={false}
                                            {...field}
                                            />
                                    } 
                                    disabled={props.formDisabled}
                                    label={<>
                                        {t('gasless_checkbox_label')}
                                        <WithTooltip tooltipText={t('gasless_checkbox_label_hint', {maxGasPrice: maxGasPrice })}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                                    </>}
                                    />
                            } /> 
                    }
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
                                label={<TermsOfService />}
                                />
                        } />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant='contained'
                        type="submit"
                        disabled={!readyToSubmit}
                        fullWidth
                        sx={{ p: 1 }}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="fa" />
                        {t('button_buy')}
                    </Button>
                    {loadingBar}
                </Grid>
            </Grid>
        </form>

        {/* <DevTool control={control} /> */}
    </>);
}
