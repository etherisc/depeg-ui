import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

export const DISPLAY_PRECISION = parseInt(process.env.NEXT_PUBLIC_DEPECT_TOKEN_DISPLAY_PRECISION || '2');
export const USD1_DECIMALS = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD1_DECIMALS || '6');
export const USD2_DECIMALS = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD1_DECIMALS || '6');

export function formatCurrency(value: number | undefined, decimals: number, displayPrecision?: number): string {
    if (value === undefined) {
        return "";
    }
    return (value / Math.pow(10, decimals)).toLocaleString(undefined, { useGrouping: true, 
        minimumFractionDigits: displayPrecision || DISPLAY_PRECISION,
        maximumFractionDigits: displayPrecision || DISPLAY_PRECISION });
}

export function formatCurrencyBN(value: BigNumber, decimals: number, roundDownDecimals?: number): string {
    if (value === undefined) {
        return "";
    }

    let val = parseFloat(formatUnits(value, decimals));

    if (roundDownDecimals !== undefined) {
        val = roundDownToDec(val, roundDownDecimals);
    }
    
    return val.toLocaleString(undefined, { useGrouping: true, 
        minimumFractionDigits: DISPLAY_PRECISION,
        maximumFractionDigits: DISPLAY_PRECISION });
}

function roundDownToDec(float: number, decimals: number) {
    const factor = Math.pow(10, decimals);
    return Math.floor(float * factor) / factor;
}

export function toHexString(valStr: string): string {
    return '0x' + parseInt(valStr).toString(16);
}

export function toHex(number: number): string {
    return '0x' + number.toString(16);
}