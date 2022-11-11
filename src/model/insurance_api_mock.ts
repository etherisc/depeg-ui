import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { delay } from "../utils/delay";
import { InsuranceApi } from "./insurance_api";

export function insuranceApiMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        usd2: 'USDT',
        insuredAmountMin: 3000,
        insuredAmountMax: 10000,
        coverageDurationDaysMin: 14,
        coverageDurationDaysMax: 45,
        calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number) {
          return Promise.resolve(insuredAmount * 0.017);
        },
        async createApproval(walletAddress: string, premium: number) {
            enqueueSnackbar(`Approval mocked (${walletAddress}, ${premium}`,  { autoHideDuration: 3000, variant: 'info' });
            await delay(2000);
            return Promise.resolve(true);
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays) {
            enqueueSnackbar(`Policy mocked (${walletAddress}, ${insuredAmount}, ${coverageDurationDays})`,  { autoHideDuration: 3000, variant: 'info' });
            await delay(2000);
            return Promise.resolve(true);
        }
    } as InsuranceApi;
}