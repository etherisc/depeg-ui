import { TextField, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";
import { Control, Controller } from "react-hook-form";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrencyBN } from "../../utils/numbers";
import { IAplicationFormValues } from "./application_form";
import { AvailableBundleList } from "./available_bundle_list";

export interface PremiumProps {
    disabled: boolean;
    premiumAmount: string | undefined;
    premiumCurrency: string;
    premiumCurrencyDecimals: number;
    helperText: string;
    helperTextIsError: boolean;
    trxTextKey: string;
    transactionInProgress?: boolean;
    control: Control<IAplicationFormValues, any>;
}

export default function Premium(props: PremiumProps) {
    const { t } = useTranslation('application');

    const wait = props.transactionInProgress ? 
        (<><LinearProgress /><Typography variant="body2">{t(props.trxTextKey)}</Typography></>) 
        : null;

    let matchedBundleText: string | undefined = undefined;
    
    let valueBN = undefined;
    let value = "";

    if (props.premiumAmount !== undefined) {
        valueBN = BigNumber.from(props.premiumAmount);
        value = parseFloat(formatUnits(valueBN, props.premiumCurrencyDecimals)).toFixed(2);
    }

    // make premum field green if premium has been found, red if no match could be found and grey otherwise (no/invalid input)
    const color = (valueBN !== undefined && valueBN.gt(0)) ? "success" : (props.helperTextIsError) ? "error" : undefined; // undefined => grey
    const disabled = props.disabled || valueBN === undefined || valueBN.eq(0);

    return (<>
        <TextField 
            label={t('premiumAmount')}
            fullWidth
            variant="outlined"
            color={color}
            disabled={disabled}
            focused
            value={value}
            InputProps={{
                readOnly: true,
                startAdornment: <InputAdornment position="start">{props.premiumCurrency}</InputAdornment>,
            }}
            error={props.helperTextIsError}
            helperText={matchedBundleText || props.helperText}
            />
        {wait}
    </>);
}