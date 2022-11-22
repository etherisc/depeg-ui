import { TextField, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { formatCurrency } from "../../utils/numbers";
import { FormNumber } from "../../utils/types";
import { INPUT_VARIANT } from "../shared/form/numeric_text_field";

export interface PremiumProps {
    disabled: boolean;
    premium: FormNumber;
    currency: string;
    error?: string;
    text?: string;
    transactionInProgress?: boolean;
}

export default function Premium(props: PremiumProps) {
    const { t } = useTranslation('application');

    const wait = props.transactionInProgress ? 
        (<><LinearProgress />{props.text}</>) 
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
            value={formatCurrency(props.premium)}
            InputProps={{
                startAdornment: <InputAdornment position="start">{props.currency}</InputAdornment>,
                readOnly: true,
            }}
            error={props.error !== ""}
            helperText={props.error}
            />
            <Typography variant="body2">{wait}</Typography>
    </>);
}