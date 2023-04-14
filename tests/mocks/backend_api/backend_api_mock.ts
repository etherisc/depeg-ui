import dayjs from "dayjs";
import { BigNumber } from "ethers/lib/ethers";
import { parseUnits } from "ethers/lib/utils";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { BackendApi, ApplicationApi, BundleManagementApi } from "../../../src/backend/backend_api";
import { BundleData } from "../../../src/backend/bundle_data";
import { PolicyData } from "../../../src/backend/policy_data";
import { PriceFeedApi } from "../../../src/backend/price_feed/api";
import { DepegState } from "../../../src/types/depeg_state";
import { delay } from "../../../src/utils/delay";
import { ComponentState } from "../../../src/types/component_state";

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
        async getDepegState() {
            return Promise.resolve(DepegState.Active);
        },
        application: applicationMock(),
        bundleManagement: bundleManagementMock(),
        triggerBundleUpdate(bundleId: number) {
            return Promise.resolve({} as BundleData);
        },
        priceFeed: {
            getLatestPrice(priceRetrieved: (price: PriceInfo) => void): Promise<void> {
                return Promise.resolve();
            },
            getLatestProductState(stateRetrieved: (triggeredAt: number, depeggedAt: number) => void): Promise<void> {
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

export function mockSimpleRemainingRiskpoolCapSmallerThanBundleCap() {
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
        async getDepegState() {
            return Promise.resolve(DepegState.Active);
        },
        application: applicationMock(),
        bundleManagement: bundleManagementMock(parseUnits("1000", 6)),
        triggerBundleUpdate(bundleId: number) {
            return Promise.resolve({} as BundleData);
        },
        priceFeed: {
            getLatestPrice(priceRetrieved: (price: PriceInfo) => void): Promise<void> {
                return Promise.resolve();
            },
            getLatestProductState(stateRetrieved: (triggeredAt: number, depeggedAt: number) => void): Promise<void> {
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
        protectedAmount: BigNumber.from(10000).toString()
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
        protectedAmount: BigNumber.from(11000000000).toString()
    } as PolicyData,
];

const bundles = [
    {
        "id": 21,
        "riskpoolId": 11,
        "owner": "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
        "apr": 2.5,
        "minProtectedAmount": BigNumber.from(2300000000).toString(),
        "maxProtectedAmount": BigNumber.from(2500000000).toString(),
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
        protectedAmountMin: BigNumber.from(1000),
        protectedAmountMax: BigNumber.from(2000),
        coverageDurationDaysMin: 14,
        coverageDurationDaysMax: 45,
        getRiskBundles(handleBundle: (bundle: BundleData) => void) {
        },
        fetchStakeableRiskBundles(handleBundle) {
        },
        calculatePremium(walletAddress: string, insuredAmount: BigNumber, coverageDurationSeconds: number, bundle: BundleData): Promise<BigNumber> {
            return Promise.resolve(insuredAmount.div(10));
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationSeconds, bundleId, gasless: boolean) {
            await delay(2000);
            return Promise.resolve({ status: true, processId: "0x12345678"});
        },
        lastBlockTimestamp(): Promise<number> {
            return Promise.resolve(dayjs().unix());
        },
        getProductComponentState() {
            return Promise.resolve(ComponentState.Active);
        },
    } as ApplicationApi
}

function bundleManagementMock(
    remainingRiskpoolCapacity: BigNumber = parseUnits("25000", 6), 
    bundleCapitalCap: BigNumber = parseUnits("2500", 6),
) {
    return {
        usd1: 'USDC',
        minLifetime: 14,
        maxLifetime: 180,
        minStakedAmount: BigNumber.from(400),
        maxStakedAmount: BigNumber.from(10000),
        minProtectedAmount: BigNumber.from(2000),
        maxProtectedAmount: BigNumber.from(100000),
        minProtectionDuration: 14,
        maxProtectionDuration: 120,
        annualPctReturn: 5,
        maxAnnualPctReturn: 15,
        isRiskpoolCapacityAvailable() {
            return Promise.resolve(true);
        },
        riskpoolRemainingCapacity() {
            return Promise.resolve(remainingRiskpoolCapacity);
        },
        async isAllowAllAccountsEnabled(): Promise<boolean> {
            return Promise.resolve(true);
        },
        isInvestorWhitelisted(walletAddress: string) {
            return Promise.resolve(true);
        },
        async stake(
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
        getBundleCapitalCap(): Promise<BigNumber> {
            return Promise.resolve(bundleCapitalCap);
        },
        getBundleLifetimeMin(): Promise<number> {
            return Promise.resolve(14 * 24 * 60 * 60);
        },
        getBundleLifetimeMax(): Promise<number> {
            return Promise.resolve(180 * 24 * 60 * 60);
        },
        async getProtectedAmountFactor(): Promise<number> {
            return Promise.resolve(5);
        },
        getRiskpoolComponentState() {
            return Promise.resolve(ComponentState.Active);
        },
    } as BundleManagementApi;
};
