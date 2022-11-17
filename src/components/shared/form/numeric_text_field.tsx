import { InputProps } from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useState } from "react";
import { formatCurrency } from "../../utils/numbers";

export interface NumericTextFieldProps {
    value: number;
    unit: string;
    onChange: (value: number) => void;
    disabled: boolean;
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

    function handleValueChange(x: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = (x.target as HTMLInputElement).value;
        if (val == "") {
            props.onChange(0);
            return;
        }
        props.onChange(parseInt(val));
    }

    const [ error, setError ] = useState("");
    function validateValue() {
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
    }

    function handleError(error: string) {
        setError(error);
        if (props.onError) {
            props.onError(error);
        }
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
            InputProps={props.inputProps}
            value={props.value}
            onChange={handleValueChange}
            onBlur={validateValue}
            helperText={error}
            error={error != ""}
            />
    );
}