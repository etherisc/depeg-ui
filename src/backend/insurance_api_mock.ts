import { BigNumber } from "ethers/lib/ethers";
import moment from "moment";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { ApplicationApi, InsuranceApi, InvestApi } from "./insurance_api";
import { delay } from "../utils/delay";
import { BundleData } from "./bundle_data";
import { PolicyData } from "./policy_data";

export function insuranceApiMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        usd1Decimals: 6,
        usd2: 'USDT',
        usd2Decimals: 6,
        async createTreasuryApproval(walletAddress: string, premium: number) {
            enqueueSnackbar(`Approval mocked (${walletAddress}, ${premium}`,  { autoHideDuration: 3000, variant: 'info' });
            await delay(2000);
            return Promise.resolve(true);
        },
        async policy(walletAddress: string, idx: number): Promise<PolicyData> {
            return Promise.resolve(mockPolicies[idx]);
        },
        async policies(walletAddress: string): Promise<Array<PolicyData>> {
            return Promise.resolve(mockPolicies);
        },
        async policiesCount(walletAddress: string): Promise<number> {
            return Promise.resolve(mockPolicies.length);
        },
        application: applicationMock(enqueueSnackbar),
        invest: investMock(enqueueSnackbar),
    } as InsuranceApi;
}

const mockPoliciesActive = [
    {
        processId: '0x54E190322453300229D2BE2A38450B8A8BD8CF61',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        createdAt: BigNumber.from(moment().add('-2', 'days').unix()),
        duration: BigNumber.from(14 * 24 * 60 * 60),
        premium: BigNumber.from(17),
        suminsured: BigNumber.from(10000)
    } as PolicyData,
    {
        processId: '0x54E190322453300229D2BE2A38450B8A8BD8CF62',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        payoutState: 0,
        createdAt: BigNumber.from(moment().add('-2', 'days').unix()),
        duration: BigNumber.from(14 * 24 * 60 * 60),
        premium: BigNumber.from(17),
        suminsured: BigNumber.from(11000000000)
    } as PolicyData,
    {
        processId: '0x54E190322453300229D2BE2A38450B8A8BD8CF63',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        payoutState: 1,
        createdAt: BigNumber.from(moment().add('-2', 'days').unix()),
        duration: BigNumber.from(14 * 24 * 60 * 60),
        premium: BigNumber.from(17),
        suminsured: BigNumber.from(12000000000)
    } as PolicyData,
    {
        processId: '0x34e190322453300229d2be2a38450b8a8bd8cf64',
        owner: '0xdCeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 0,
        createdAt: BigNumber.from(moment().add('-1', 'days').unix()),
        duration: BigNumber.from(47 * 24 * 60 * 60),
        premium: BigNumber.from(27),
        suminsured: BigNumber.from(15000000000)
    } as PolicyData,
];

const mockPolicies = mockPoliciesActive.concat(
    {
        processId: '0x23e190322453300229d2be2a38450b8a8bd8cf71',
        owner: '0xFEeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 1,
        createdAt: BigNumber.from(moment().add(-20, 'days').unix()),
        duration: BigNumber.from(14 * 24 * 60 * 60),
        premium: BigNumber.from(100),
        suminsured: BigNumber.from(35000)
    } as PolicyData,
    {
        processId: '0xc23223453200229d2be2a38450b8a8bd8cf72',
        owner: '0x821c4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 2,
        createdAt: BigNumber.from(moment().add(-3, 'months').unix()),
        duration: BigNumber.from(28 * 24 * 60 * 60),
        premium: BigNumber.from(67),
        suminsured: BigNumber.from(36000000000)
    } as PolicyData,
);

function applicationMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        insuredAmountMin: 3000000000,
        insuredAmountMax: 10000000000,
        coverageDurationDaysMin: 14,
        coverageDurationDaysMax: 45,
        getRiskBundles() {
            return Promise.resolve(new Array());
        },
        calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number, bundles: Array<BundleData>) {
            return Promise.resolve(insuredAmount * 0.017 * coverageDurationDays / 365);
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays, premium) {
            enqueueSnackbar(`Policy mocked (${walletAddress}, ${insuredAmount}, ${coverageDurationDays})`,  { autoHideDuration: 3000, variant: 'info' });
            await delay(2000);
            return Promise.resolve(true);
        },
    } as ApplicationApi
}

function investMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        minInvestedAmount: 25000000000,
        maxInvestedAmount: 100000000000,
        minSumInsured: 1000000000,
        maxSumInsured: 25000000000,
        minCoverageDuration: 14,
        maxCoverageDuration: 90,
        annualPctReturn: 5,
        maxAnnualPctReturn: 20,
        async invest(
            investorWalletAddress: string, 
            investedAmount: number, 
            minSumInsured: number, 
            maxSumInsured: number, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number
        ): Promise<boolean> {
            enqueueSnackbar(
                `Riskpool mocked ($investorWalletAddress, $investedAmount, $minSumInsured, $maxSumInsured, $minDuration, $maxDuration, $annualPctReturn)`,
                { autoHideDuration: 3000, variant: 'info' }
            );
            await delay(2000);
            return Promise.resolve(true);
        },
        bundleTokenAddress(): Promise<string> {
            return Promise.resolve("0x0000000000000000000000000000000000000000");
        },
        bundleCount(): Promise<number> {
            return Promise.resolve(2);
        },
        bundle(walletAddress: string, bundleTokenAddress: string, i: number): Promise<BundleData|undefined> {
            // TODO: return mock
            return Promise.resolve(undefined);
        }
    } as InvestApi;
};
