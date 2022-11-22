import { FormNumber } from "./types";

export function formatCurrency(value: FormNumber): string {
    if (value === undefined) {
        return "";
    }
    return value.toLocaleString();
}