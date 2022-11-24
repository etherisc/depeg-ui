import { InputProps } from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FormNumber } from "../../../utils/types";

export interface NumericTextFieldProps {
    value: FormNumber;
    unit: string;
    onChange: (value: FormNumber) => void;
    onBlur?: () => void;
    disabled: boolean;
    readOnly?: boolean;
    required: boolean;
    fullWidth: boolean;
    id: string;
    label: string;
    inputProps: InputProps;
    minValue: number;
    maxValue: number;
    extraValidation?: (value: number) => string;
    onError?: (errorMsg: string) => void;
}

export const INPUT_VARIANT = 'outlined';

export default function NumericTextField(props: NumericTextFieldProps) {
    const { t } = useTranslation('common');
    const [ displayValue, setDisplayValue ] = useState<string>(props.value?.toString() ?? "");
    const [ error, setError ] = useState("");
    
    const value = props.value;
    const onBlur = props.onBlur;
    const label = props.label;
    const unit = props.unit;
    const disabled = props.disabled;
    const minValue = props.minValue;
    const maxValue = props.maxValue;
    const extraValidation = props.extraValidation;
    const onError = props.onError;


    function handleDisplayValueChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        setDisplayValue(val);
    }

    function changeValue() {
        console.log("changeValue");
        let val;
        if (displayValue !== undefined && displayValue !== "") {
            val = parseFloat(displayValue);
        } else {
            val = undefined;
        }
        console.log("val", val);
        props.onChange(val);
        const error = validateValue(val);
        console.log("error", error);
        handleError(error);
    }

    // call onBlur AFTER value update has been propagated
    useEffect(() => {
        if (onBlur !== undefined) {
            onBlur();
        }
    }, [onBlur, value]);

    function handleError(error: string) {
        setError(error);
        if (onError) {
            onError(error);
        }
    }

    const validateValue = useCallback((valueToValidate: number | undefined): string => {
        console.log("validateValue", valueToValidate);
    
        if (disabled) {
            return "";
        }
        if (valueToValidate === undefined) {
            return t('error.valueRequired', { fieldName: label });
        }
        if (valueToValidate < minValue) {
            return t('error.numericTextFieldMinValue', { fieldName: label, value: minValue, unit: unit });
        } 
        if (valueToValidate > maxValue) {
            return t('error.numericTextFieldMaxValue', { fieldName: label, value: maxValue, unit: unit });
        }
        if (extraValidation !== undefined) {
            const errorMsg = extraValidation(valueToValidate);
            if (errorMsg && errorMsg !== "") {
                return errorMsg;
            }
        }
        return "";
    }, [disabled, extraValidation, label, minValue, maxValue, unit, t]);


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