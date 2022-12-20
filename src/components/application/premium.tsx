import { TextField, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Control, Controller } from "react-hook-form";
import { BundleData } from "../../backend/bundle_data";
import { INPUT_VARIANT } from "../../config/theme";
import { FormNumber } from "../../utils/types";
import { IAplicationFormValues } from "./application_form";
import { BundleList } from "./bundle_list";

export interface PremiumProps {
    disabled: boolean;
    premium: FormNumber;
    premiumCurrency: string;
    premiumCurrencyDecimals: number;
    bundleCurrency: string;
    bundleCurrencyDecimals: number;
    error: string;
    textKey: string;
    transactionInProgress?: boolean;
    bundles: Array<BundleData>;
    showBundles: boolean;
    control: Control<IAplicationFormValues, any>;
}

export default function Premium(props: PremiumProps) {
    const { t } = useTranslation('application');

    let bundles = undefined;

    if (props.showBundles) {
        bundles = (<BundleList 
            currency={props.bundleCurrency}
            currencyDecimals={props.bundleCurrencyDecimals}
            bundles={props.bundles} />);
    }

    const wait = props.transactionInProgress ? 
        (<><LinearProgress />{t(props.textKey)}</>) 
        : null;

    return (<>
        <Controller
            name="premiumAmount"
            control={props.control}
            render={({ field }) => 
                <TextField 
                    label={t('premiumAmount')}
                    fullWidth
                    disabled={props.disabled}
                    variant={INPUT_VARIANT}
                    {...field} 
                    value={field.value !== undefined ? field.value.toFixed(2) : ""}
                    InputProps={{
                        readOnly: true,
                        startAdornment: <InputAdornment position="start">{props.premiumCurrency}</InputAdornment>,
                    }}
                    error={props.error !== ""}
                    helperText={props.error}
                    />}
            />
        <Typography variant="body2">{wait}</Typography>
        {bundles}
    </>);
}