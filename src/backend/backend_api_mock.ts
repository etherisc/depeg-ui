import { BigNumber } from "ethers/lib/ethers";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { ApplicationApi, BackendApi, InvestApi } from "./backend_api";
import { delay } from "../utils/delay";
import { BundleData } from "./bundle_data";
import { PolicyData } from "./policy_data";
import dayjs from "dayjs";
import { ProductState } from "../types/product_state";

export function BackendApiMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        usd1Decimals: 6,
        usd2: 'USDT',
        usd2Decimals: 6,
        getWalletAddress(): Promise<string> {
            return Promise.resolve("0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729");
        },
        async hasUsd2Balance(walletAddress: string, amount: BigNumber): Promise<boolean> {
            return Promise.resolve(true);
        },
        async createTreasuryApproval(walletAddress: string, premium: BigNumber) {
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
        async getProductState() {
            return Promise.resolve(ProductState.Active);
        },
        application: applicationMock(enqueueSnackbar),
        invest: investMock(enqueueSnackbar),
    } as BackendApi;
}

const mockPoliciesActive = [
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF61',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        createdAt: dayjs().add(-2, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(17).toString(),
        suminsured: BigNumber.from(10000).toString()
    } as PolicyData,
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF62',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        payoutState: 0,
        createdAt: dayjs().add(-2, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(17).toString(),
        suminsured: BigNumber.from(11000000000).toString()
    } as PolicyData,
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF63',
        owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        payoutState: 1,
        createdAt: dayjs().add(-2, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(17).toString(),
        suminsured: BigNumber.from(12000000000).toString()
    } as PolicyData,
    {
        id: '0x34e190322453300229d2be2a38450b8a8bd8cf64',
        owner: '0xdCeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 0,
        createdAt: dayjs().add(-1, 'days').unix(),
        duration: 47 * 24 * 60 * 60,
        premium: BigNumber.from(27).toString(),
        suminsured: BigNumber.from(15000000000).toString()
    } as PolicyData,
];

const mockPolicies = mockPoliciesActive.concat(
    {
        id: '0x23e190322453300229d2be2a38450b8a8bd8cf71',
        owner: '0xFEeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 1,
        createdAt: dayjs().add(-20, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(100).toString(),
        suminsured: BigNumber.from(35000).toString()
    } as PolicyData,
    {
        id: '0xc23223453200229d2be2a38450b8a8bd8cf72',
        owner: '0x821c4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 2,
        createdAt: dayjs().add(-3, 'months').unix(),
        duration: 28 * 24 * 60 * 60,
        premium: BigNumber.from(67).toString(),
        suminsured: BigNumber.from(36000000000).toString()
    } as PolicyData,
);

const bundles = [
    {
        "id": 21,
        "riskpoolId": 11,
        "owner": "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
        "apr": 2.5,
        "minSumInsured": BigNumber.from(2300000000).toString(),
        "maxSumInsured": BigNumber.from(2500000000).toString(),
        "minDuration": 1987200,
        "maxDuration": 2160000,
        "capital": BigNumber.from(100000000000).toString(),
        "locked": BigNumber.from(0).toString(),
        "capacity": BigNumber.from(100000000000).toString(),
        "policies": 0,
        "state": 0,
        "tokenId": 21,
        "createdAt": 1672758484,
        "name": "jabababado",
        "lifetime": (90 * 24 * 60 * 60).toString(),
    } as BundleData
];

function applicationMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        insuredAmountMin: BigNumber.from(3000000000),
        insuredAmountMax: BigNumber.from(10000000000),
        coverageDurationDaysMin: 14,
        coverageDurationDaysMax: 45,
        getRiskBundles(handleBundle: (bundle: BundleData) => void) {
        },
        fetchRiskBundles(handleBundle) {
        },
        calculatePremium(walletAddress: string, insuredAmount: BigNumber, coverageDurationDays: number, bundles: Array<BundleData>): Promise<[BigNumber, BundleData]> {
            const premium = insuredAmount.toNumber() * 0.017 * coverageDurationDays / 365;
            return Promise.resolve([BigNumber.from(premium), bundles[0]]);
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays, premium) {
            enqueueSnackbar(`Policy mocked (${walletAddress}, ${insuredAmount}, ${coverageDurationDays})`,  { autoHideDuration: 3000, variant: 'info' });
            await delay(2000);
            return Promise.resolve({ status: true, processId: "0x12345678"});
        },
        lastBlockTimestamp(): Promise<number> {
            return Promise.resolve(dayjs().unix());
        }
    } as ApplicationApi
}

function investMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        minLifetime: 14,
        maxLifetime: 180,
        minInvestedAmount: BigNumber.from(25000000000),
        maxInvestedAmount: BigNumber.from(100000000000),
        minSumInsured: BigNumber.from(1000000000),
        maxSumInsured: BigNumber.from(25000000000),
        minCoverageDuration: 14,
        maxCoverageDuration: 90,
        annualPctReturn: 5,
        maxAnnualPctReturn: 20,
        async invest(
            name: string,
            lifetime: number,
            investorWalletAddress: string, 
            investedAmount: BigNumber, 
            minSumInsured: BigNumber, 
            maxSumInsured: BigNumber, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number
        ): Promise<{ status: boolean, bundleId: string | undefined}> {
            enqueueSnackbar(
                `Riskpool mocked ($name, $lifetime, $investorWalletAddress, $investedAmount, $minSumInsured, $maxSumInsured, $minDuration, $maxDuration, $annualPctReturn)`,
                { autoHideDuration: 3000, variant: 'info' }
            );
            await delay(2000);
            return Promise.resolve({ status: true, bundleId: "42"});
        },
        bundleTokenAddress(): Promise<string> {
            return Promise.resolve("0x0000000000000000000000000000000000000000");
        },
        bundleCount(): Promise<number> {
            return Promise.resolve(2);
        },
        bundleId(idx) {
            return Promise.resolve(idx);
        },
        bundle(bundleId: number, walletAddress: string): Promise<BundleData|undefined> {
            return Promise.resolve(undefined);
        },
        maxBundles(): Promise<number> {
            return Promise.resolve(100);
        },
    } as InvestApi;
};
