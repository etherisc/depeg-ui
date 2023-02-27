import dayjs from "dayjs";
import { BigNumber } from "ethers/lib/ethers";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { BackendApi, ApplicationApi, InvestApi } from "../../../src/backend/backend_api";
import { BundleData } from "../../../src/backend/bundle_data";
import { PolicyData } from "../../../src/backend/policy_data";
import { PriceFeedApi } from "../../../src/backend/price_feed/api";
import { ProductState } from "../../../src/types/product_state";
import { delay } from "../../../src/utils/delay";

export function mockSimple() {
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
            await delay(2000);
            return Promise.resolve(true);
        },
        async policy(walletAddress: string, idx: number, checkClaim: boolean): Promise<PolicyData> {
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
        application: applicationMock(),
        invest: investMock(),
        triggerBundleUpdate(bundleId: number) {
            return Promise.resolve({} as BundleData);
        },
        priceFeed: {
            getLatestPrice(priceRetrieved: (price: PriceInfo, triggeredAt: number, depeggedAt: number) => void): Promise<void> { 
                return Promise.resolve();
            },
            getPrice(roundId: BigNumber, priceRetrieved: (price: PriceInfo) => void): Promise<void> {
                return Promise.resolve();
            },
            getAllPricesAfter(
                after: number, 
                priceRetrieved: (price: PriceInfo) => void,
                loadingStarted: () => void,
                loadingFinished: () => void,
            ): Promise<void> {
                return Promise.resolve();
            }
        } as PriceFeedApi,
    };
}

const mockPolicies = [
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF61',
        policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        applicationState: 2,
        policyState: 0,
        createdAt: dayjs().add(-2, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(17).toString(),
        suminsured: BigNumber.from(10000).toString()
    } as PolicyData,
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF62',
        policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        protectedWallet: '0xA3C552FA4756dd343394785283923bE2f27f8814',
        applicationState: 2,
        policyState: 0,
        payoutState: 0,
        createdAt: dayjs().add(-2, 'days').unix(),
        duration: 14 * 24 * 60 * 60,
        premium: BigNumber.from(17).toString(),
        suminsured: BigNumber.from(11000000000).toString()
    } as PolicyData,
];

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

function applicationMock() {
    return {
        insuredAmountMin: BigNumber.from(1000),
        insuredAmountMax: BigNumber.from(2000),
        coverageDurationDaysMin: 14,
        coverageDurationDaysMax: 45,
        getRiskBundles(handleBundle: (bundle: BundleData) => void) {
        },
        fetchStakeableRiskBundles(handleBundle) {
        },
        calculatePremium(walletAddress: string, insuredAmount: BigNumber, coverageDurationSeconds: number, bundle: BundleData): Promise<BigNumber> {
            const premium = insuredAmount.toNumber() * 0.017 * coverageDurationSeconds / 365;
            return Promise.resolve(BigNumber.from(premium));
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationSeconds, bundleId) {
            await delay(2000);
            return Promise.resolve({ status: true, processId: "0x12345678"});
        },
        lastBlockTimestamp(): Promise<number> {
            return Promise.resolve(dayjs().unix());
        }
    } as ApplicationApi
}

function investMock() {
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
        maxAnnualPctReturn: 15,
        isRiskpoolCapacityAvailable() {
            return Promise.resolve(true);
        },
        riskpoolRemainingCapacity() {
            return Promise.resolve(BigNumber.from(10000000000000));
        },
        isInvestorWhitelisted(walletAddress: string) {
            return Promise.resolve(true);
        },
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
            await delay(2000);
            return Promise.resolve({ status: true, bundleId: "42"});
        },
        fetchAllBundles(handleBundle: (bundle: BundleData) => void) {
            bundles.forEach(handleBundle);
            return Promise.resolve();
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
        activeBundles(): Promise<number> {
            return Promise.resolve(2);
        },
        async lockBundle(bundleId: number): Promise<boolean> {
            return Promise.resolve(true);
        },
        async unlockBundle(bundleId: number): Promise<boolean> {
            return Promise.resolve(true);
        },
        async closeBundle(bundleId: number): Promise<boolean> {
            return Promise.resolve(true);
        },
        async burnBundle(bundleId: number): Promise<boolean> {
            return Promise.resolve(true);
        },
        async withdrawBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
            return Promise.resolve(true);
        },
        async fundBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
            return Promise.resolve(true);
        },
    } as InvestApi;
};
