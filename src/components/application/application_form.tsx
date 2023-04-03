import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
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
import { ApplicationApi, BackendApi } from '../../backend/backend_api';
import { BundleData, MAX_BUNDLE } from '../../backend/bundle_data';
import { REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS } from '../../config/appConfig';
import { INPUT_VARIANT } from '../../config/theme';
import { clearPremium, setApplicableBundleIds, setPremium, setPremiumCalculationInProgress, setPremiumErrorKey } from '../../redux/slices/application';
import { RootState } from '../../redux/store';
import { filterApplicableBundles } from '../../utils/bundles';
import TermsOfService from '../terms_of_service';
import { AvailableBundleList } from './available_bundle_list';
import PayoutExample from './payout_example';
import Premium from './premium';

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
    applyForPolicy: (walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => void;
}

export type IAplicationFormValues = {
    insuredWallet: string;
    insuredAmount: string;
    coverageDuration: string;
    coverageEndDate: Dayjs;
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

    const [ insuredAmountMin, setInsuredAmountMin ] = useState(props.applicationApi.insuredAmountMin.toNumber());
    const [ insuredAmountMax, setInsuredAmountMax ] = useState(props.applicationApi.insuredAmountMax.toNumber());

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
            insuredAmount: undefined,
            coverageDuration: props.applicationApi.coverageDurationDaysMax.toString(),
            coverageEndDate: dayjs().add(props.applicationApi.coverageDurationDaysMax, 'days'),
            termsAndConditions: false,
        }
    });

    const watchInsuredAmount = watch("insuredAmount");

    // update wallet address when it changes
    useEffect(() => {
        setValue("insuredWallet", props.connectedWalletAddress);
    }, [props.connectedWalletAddress, setValue]);

    const errors = useMemo(() => formState.errors, [formState]);

    const validateFormState = useCallback(() => {
        // console.log("validateFormState");
        if (formState.touchedFields.insuredAmount === undefined) {
            console.log("amount not touched, not calculating premium...");
            return false;
        }

        if (errors.coverageDuration !== undefined || errors.insuredWallet !== undefined || errors.insuredAmount !== undefined) {
            console.log("Form is invalid, not calculating premium...");
            return false;
        }

        if (bundles.length == 0) {
            console.log("No bundles, not calculating premium...");
            return false;
        }
        return true;
    }, [errors, formState.touchedFields.insuredAmount, bundles.length]);

    const getPremiumParameters = useCallback(() => {
        // console.log("getPremiumParameters");
        const values = getValues();
        const insuredWallet = values.insuredWallet;
        const insuredAmount = parseUnits(values.insuredAmount ?? "0", props.usd1Decimals);
        const coverageSeconds = parseInt(values.coverageDuration) * 24 * 60 * 60;
        return { insuredWallet, insuredAmount, coverageSeconds };
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
        try {
            const { insuredWallet, insuredAmount, coverageSeconds } = getPremiumParameters();
            // filter bundles matching application
            const fbid = filterApplicableBundles(bundles, insuredAmount, coverageSeconds).map(b => b.id);
            dispatch(setApplicableBundleIds(fbid));
            console.log("fbid", fbid);

            if (fbid.length == 0) {
                dispatch(clearPremium());
                return;
            }
            
            const remainingBundles = bundles.filter((b: BundleData) => fbid.includes(b.id));
            console.log("remainingBundles", remainingBundles);

            // select the bundle with the lowest APR
            const bestBundle = remainingBundles.reduce((prev: BundleData, current: BundleData) => prev.apr < current.apr ? prev : current, MAX_BUNDLE);
            console.log("bestBundle", bestBundle);

            // calculate premium
            const premium = await props.applicationApi.calculatePremium(insuredWallet, insuredAmount, coverageSeconds, bestBundle);
            console.log("premium", premium.toString());
            dispatch(setPremium([bestBundle.id, premium.toString()]));
        } finally {
            dispatch(setPremiumCalculationInProgress(false));
        }
    }, [bundles, dispatch, getPremiumParameters, validateFormState, props.applicationApi]);

    //-------------------------------------------------------------------------
    // update min/max sum insured and coverage period when bundles are available
    useEffect(() => {
        if (bundles.length > 0) {
            let minSumInsured = BigNumber.from(Number.MAX_SAFE_INTEGER - 1);
            let maxSumInsured = BigNumber.from(0);
            let minCoverageSecs = Number.MAX_SAFE_INTEGER;
            let maxCoverageSecs = 0;
            for( let b of bundles) {
                const bminSumInsured = BigNumber.from(b.minSumInsured);
                const bmaxSumInsured = BigNumber.from(b.maxSumInsured);

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
            setInsuredAmountMin(parseInt(formatUnits(minSumInsured, props.usd1Decimals)));
            setInsuredAmountMax(parseInt(formatUnits(maxSumInsured, props.usd1Decimals)));
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
        const { insuredWallet, insuredAmount, coverageSeconds } = getPremiumParameters();
        const premium = await props.applicationApi.calculatePremium(insuredWallet, insuredAmount, coverageSeconds, bundle);
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
            const insuredAmountWei = parseUnits(values.insuredAmount, props.usd1Decimals);
            const coverageSeconds = parseInt(values.coverageDuration) * 24 * 60 * 60;
            props.applyForPolicy(walletAddress, insuredAmountWei, coverageSeconds, BigNumber.from(premium), selectedBundleId!);
        } finally {
            setApplicationInProgress(false);
        }
    }

    async function checkBalanceForPremium() {
        // console.log("checkBalanceForPremium", premium);
        if (premium === undefined || premium === "") {
            dispatch(setPremiumErrorKey(undefined));
            return;
        }
        const hasBalance = await props.hasBalance(props.connectedWalletAddress, BigNumber.from(premium));
        console.log("hasBalance", premium, hasBalance);
        if (! hasBalance) {
            dispatch(setPremiumErrorKey("error_wallet_balance_too_low"));
        } else {
            dispatch(setPremiumErrorKey(undefined));
        }
    }

    // always check balance when premium changes
    checkBalanceForPremium();

    const readyToSubmit = formState.isValid && ! premiumCalculationInProgress && ! props.formDisabled && selectedBundleId !== undefined && premiumErrorKey === undefined;
    props.readyToSubmit(readyToSubmit);
    
    const loadingBar = applicationInProgress ? <LinearProgress /> : null;
    
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={4} mt={{ 'xs': 0, 'md': 2 }} 
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
                        name="insuredAmount"
                        control={control}
                        rules={{ required: true, min: insuredAmountMin, max: insuredAmountMax, pattern: REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS  }}
                        render={({ field }) => 
                            <TextField 
                                label={t('insuredAmount')}
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
                                error={errors.insuredAmount !== undefined}
                                helperText={errors.insuredAmount !== undefined 
                                    ? ( errors.insuredAmount.type == 'pattern' 
                                            ? t(`error.field.amountType`, { "ns": "common"}) 
                                            : t(`error.field.${errors.insuredAmount.type}`, { "ns": "common", "minValue": `${props.usd1} ${insuredAmountMin}`, "maxValue": `${props.usd1} ${insuredAmountMax}` })
                                    ) : ""}
                                data-testid="insured-amount"
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
                        insuredAmount={errors.insuredAmount !== undefined ? undefined : watchInsuredAmount}
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
                        // onClick={buy}
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
