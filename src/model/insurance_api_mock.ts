import moment from "moment";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { delay } from "../utils/delay";
import { InsuranceApi } from "./insurance_api";
import { PolicyRowView, PolicyStatus } from "./policy";

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
        },
        async policies(walletAddress: string, onlyActive: boolean): Promise<Array<PolicyRowView>> {
            if (onlyActive) {
                return Promise.resolve(mockPoliciesActive);
            }
            return Promise.resolve(mockPolicies);
        },
        invest: investMock
    } as InsuranceApi;
}

const mockPoliciesActive = [
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF66',
        walletAddress: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDC 4000.00',
        // 25 nov 2022
        coverageUntil: moment().add(14, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.ACTIVE]
    } as PolicyRowView,
    {
        id: '0x34e190322453300229d2be2a38450b8a8bd8cf66',
        walletAddress: '0xdCeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDC 10000.00',
        coverageUntil: moment().add(47, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.APPLIED]
    } as PolicyRowView,
];

const mockPolicies = mockPoliciesActive.concat(
    {
        id: '0x23e190322453300229d2be2a38450b8a8bd8cf66',
        walletAddress: '0xFEeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDT 17000.00',
        coverageUntil: moment().add(-3, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.EXPIRED]
    } as PolicyRowView,
    {
        id: '0xc23223453200229d2be2a38450b8a8bd8cf66',
        walletAddress: '0x821c4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDN 7352.00',
        coverageUntil: moment().add(-2, 'months').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.PAYED_OUT]
    } as PolicyRowView,
);

const investMock = {
    usd1: 'USDC',
    minInvestedAmount: 25000,
    maxInvestedAmount: 100000,
    minSumInsured: 1000,
    maxSumInsured: 25000,
    minCoverageDuration: 14,
    maxCoverageDuration: 90,
    annualPctReturn: 0.05
};
