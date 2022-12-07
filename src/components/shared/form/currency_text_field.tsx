import { InputProps } from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { formatCurrency } from "../../../utils/numbers";
import { FormNumber } from "../../../utils/types";
import { INPUT_VARIANT } from "./numeric_text_field";
import { parseNumber } from '@brightspace-ui/intl/lib/number.js';

export interface CurrencyTextfieldProps {
    value: FormNumber;
    currency: string;
    currencyDecimals: number;
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
    const [ displayValue, setDisplayValue ] = useState<string>(formatCurrency(props.value, props.currencyDecimals));
    const [ error, setError ] = useState("");
    
    const value = props.value;
    const onBlur = props.onBlur;
    const currency = props.currency;
    const currencyDecimals = props.currencyDecimals;
    const label = props.label;
    const disabled = props.disabled;
    const minValue = props.minValue;
    const maxValue = props.maxValue;
    const extraValidation = props.extraValidation;
    const onError = props.onError;
    const onChange = props.onChange;

    function handleDisplayValueChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        setDisplayValue(val);
    }

    function changeValue() {
        // console.log("changeValue");
        let val = parseDisplayValue(displayValue);
        // console.log("val", val);
        onChange(val);
        const error = validateValue(val);
        // console.log("error", error);
        handleError(error);
    }

    function parseDisplayValue(toParse: string) {
        if (toParse !== undefined && toParse !== "") {
            return parseNumber(toParse) * Math.pow(10, currencyDecimals)
        } else {
            return undefined;
        }
    }

    // call onBlur AFTER value update has been propagated
    useEffect(() => {
        // console.log("useEffect", "onBlur", props.value, displayValue);
        setDisplayValue(formatCurrency(props.value, currencyDecimals));
        // call onBlue when value due to user input (the displayValue matches with the incoming value)
        // otherwise update the displayValue to match the incoming value (update from outside of component)
        if (onBlur !== undefined) {
            onBlur();
        }
    }, [onBlur, props.value, currencyDecimals]); // do not react to displayValue change on purpose

    function handleError(error: string) {
        setError(error);
        if (onError !== undefined) {
            onError(error);
        }
    }

    const validateValue = useCallback((valueToValidate: number | undefined): string => {
        // console.log("validateValue", valueToValidate);

        if (disabled) {
            return "";
        }
        if (valueToValidate === undefined) {
            return t('error.valueRequired', { fieldName: label });
        }
        if (Number.isNaN(valueToValidate)) {
            return t('error.notANumber', { fieldName: label });
        }
        if (valueToValidate < minValue) {
            return t('error.currencyTextFieldMinValue', { fieldName: label, amount: formatCurrency(minValue, currencyDecimals), currency: currency });
        } 
        if (valueToValidate > maxValue) {
            return t('error.currencyTextFieldMaxValue', { fieldName: label, amount: formatCurrency(maxValue, currencyDecimals), currency: currency });
        }
        if (extraValidation !== undefined) {
            const errorMsg = extraValidation(valueToValidate);
            if (errorMsg && errorMsg !== "") {
                return errorMsg;
            }
        }
        return "";
    }, [disabled, label, currency, currencyDecimals, minValue, maxValue, extraValidation, t]);

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
            value={displayValue}
            onChange={handleDisplayValueChange}
            onBlur={changeValue}
            helperText={error}
            error={error != ""}
            />
    );
}