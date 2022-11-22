import { InputProps } from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { formatCurrency } from "../../../utils/numbers";
import { FormNumber } from "../../../utils/types";
import { INPUT_VARIANT } from "./numeric_text_field";

export interface CurrencyTextfieldProps {
    value: FormNumber;
    currency: string;
    onChange: (value: FormNumber) => void;
    onBlur?: () => void;
    disabled: boolean;
    required: boolean;
    readOnly?: boolean;
    fullWidth: boolean;
    id: string;
    label: string;
    inputProps: InputProps;
    minValue: number;
    maxValue: number;
    extraValidation?: (value: number) => string;
    onError?: (errorMsg: string) => void;
}

export default function CurrencyTextField(props: CurrencyTextfieldProps) {
    const { t } = useTranslation('common');
    const [ error, setError ] = useState("");

    function handleValueChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            props.onChange(undefined);
            return;
        }
        props.onChange(parseInt(val.replaceAll(',', '')));
    }
    
    const validateValue = useCallback(() => {
        function handleError(error: string) {
            setError(error);
            if (props.onError) {
                props.onError(error);
            }
        }
    
        if (props.disabled) {
            handleError("");
            return;
        }
        if (props.value === undefined) {
            handleError(t('error.valueRequired', { fieldName: props.label }));
            return;
        }
        if (props.value < props.minValue) {
            handleError(t('error.currencyTextFieldMinValue', { fieldName: props.label, amount: formatCurrency(props.minValue), currency: props.currency }));
            return;
        } 
        if (props.value > props.maxValue) {
            handleError(t('error.currencyTextFieldMaxValue', { fieldName: props.label, amount: formatCurrency(props.maxValue), currency: props.currency }));
            return;
        }
        if (props.extraValidation) {
            const errorMsg = props.extraValidation(props.value);
            if (errorMsg && errorMsg !== "") {
                handleError(errorMsg);
                return;
            }
        }
        handleError("");
    }, [props, t]);

    useEffect(() => {
        validateValue();
    }, [props.value, validateValue]);

    let ip = props.inputProps;
    if (props.inputProps === undefined) {
        ip = { readOnly: true }
    } else {
        ip.readOnly = props.readOnly || false;
    }

    return (
        <TextField
            fullWidth={props.fullWidth}
            disabled={props.disabled}
            required={props.required}
            variant={INPUT_VARIANT}
            id={props.id}
            label={props.label}
            type="text"
            InputProps={ip}
            value={formatCurrency(props.value)}
            onChange={handleValueChange}
            onBlur={() => { try { validateValue(); } finally { if (props.onBlur) props.onBlur(); } }}
            helperText={error}
            error={error != ""}
            />
    );
}