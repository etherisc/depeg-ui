import { FormNumber } from "./types";

export const DISPLAY_PRECISION = parseInt(process.env.NEXT_PUBLIC_DEPECT_TOKEN_DISPLAY_PRECISION || '2');
export const USD1_DECIMALS = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD1_DECIMALS || '6');
export const USD2_DECIMALS = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD1_DECIMALS || '6');

export function formatCurrency(value: FormNumber, decimals: number, displayPrecision?: number): string {
    if (value === undefined) {
        return "";
    }
    return (value / Math.pow(10, decimals)).toLocaleString(undefined, { useGrouping: true, 
        minimumFractionDigits: displayPrecision || DISPLAY_PRECISION,
        maximumFractionDigits: displayPrecision || DISPLAY_PRECISION });
}
