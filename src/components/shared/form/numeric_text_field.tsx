import { InputProps } from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

export interface NumericTextFieldProps {
    value: number;
    unit: string;
    onChange: (value: number) => void;
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
    const [ error, setError ] = useState("");
    
    function handleValueChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            props.onChange(0);
            return;
        }
        props.onChange(parseInt(val));
    }

    const validateValue = useCallback(() => {
        function handleError(error: string) {
            setError(error);
            if (props.onError) {
                props.onError(error);
            }
        }
        
        if (props.value < props.minValue) {
            handleError(t('error.numericTextFieldMinValue', { fieldName: props.label, value: props.minValue, unit: props.unit }));
            return;
        } 
        if (props.value > props.maxValue) {
            handleError(t('error.numericTextFieldMaxValue', { fieldName: props.label, value: props.maxValue, unit: props.unit }));
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
            value={props.value}
            onChange={handleValueChange}
            onBlur={() => { try { validateValue(); } finally { if (props.onBlur) props.onBlur(); } }}
            helperText={error}
            error={error != ""}
            />
    );
}