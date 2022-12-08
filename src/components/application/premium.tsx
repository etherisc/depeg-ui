import { TextField, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrency } from "../../utils/numbers";
import { FormNumber } from "../../utils/types";
import { INPUT_VARIANT } from "../form/numeric_text_field";
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
        <TextField
            required
            fullWidth
            disabled={props.disabled}
            variant={INPUT_VARIANT}
            id="premiumAmount"
            label={t('premiumAmount')}
            type="text"
            value={formatCurrency(props.premium, props.premiumCurrencyDecimals)}
            InputProps={{
                startAdornment: <InputAdornment position="start">{props.premiumCurrency}</InputAdornment>,
                readOnly: true,
            }}
            error={props.error !== ""}
            helperText={props.error}
            />
        <Typography variant="body2">{wait}</Typography>
        {bundles}
    </>);
}