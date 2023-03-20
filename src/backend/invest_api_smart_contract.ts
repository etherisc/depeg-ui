import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { minBigNumber } from "../utils/bignumber";
import { InvestApi } from "./backend_api";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { DepegRiskpoolApi } from "./riskpool_api";

export class InvestApiSmartContract implements InvestApi {
    private doNoUseDirectlydepegRiskpoolApi?: DepegRiskpoolApi;
    private depegProductApi: DepegProductApi;

    minLifetime: number;
    maxLifetime: number;
    minInvestedAmount: BigNumber;
    maxInvestedAmount: BigNumber;
    minSumInsured: BigNumber;
    maxSumInsured: BigNumber;
    minCoverageDuration: number;
    maxCoverageDuration: number;
    annualPctReturn: number;
    maxAnnualPctReturn: number;
    usd2Decimals: number;
    private riskpoolCapacityLimit: BigNumber | undefined;
    private investorWhitelist?: string[];

    constructor(depegProductApi: DepegProductApi, 
        minLifetime: number, maxLifetime: number, 
        minInvestedAmount: BigNumber, maxInvestedAmount: BigNumber, 
        minSumInsured: BigNumber, maxSumInsured: BigNumber, 
        minCoverageDuration: number, maxCoverageDuration: number, 
        annualPctReturn: number, maxAnnualPctReturn: number,
        usd2Decimals: number,
    ) {
        this.minLifetime = minLifetime;
        this.maxLifetime = maxLifetime;
        this.minInvestedAmount = minInvestedAmount;
        this.maxInvestedAmount = maxInvestedAmount;
        this.minSumInsured = minSumInsured;
        this.maxSumInsured = maxSumInsured;
        this.minCoverageDuration = minCoverageDuration;
        this.maxCoverageDuration = maxCoverageDuration;
        this.annualPctReturn = annualPctReturn;
        this.maxAnnualPctReturn = maxAnnualPctReturn;
        this.depegProductApi = depegProductApi;
        this.usd2Decimals = usd2Decimals;

        const riskpoolCapacityLimit = process.env.NEXT_PUBLIC_RISKPOOL_CAPACITY_LIMIT;
        this.riskpoolCapacityLimit = riskpoolCapacityLimit !== undefined ? parseUnits(riskpoolCapacityLimit, usd2Decimals) : undefined;

        const investorWhiteList = process.env.NEXT_PUBLIC_INVESTOR_WHITELIST;
        this.investorWhitelist = investorWhiteList !== undefined ? investorWhiteList.split(',').map(w => w.trim()) : undefined;
    }

    /**
     * @returns lazy loaded DepegProductApi
     */
    private async getDepegProductApi(): Promise<DepegProductApi> {
        if (! this.depegProductApi.isInitialized()) {
            await this.depegProductApi.initialize();
        }
        return this.depegProductApi;
    }

    /**
     * 
     * @returns lazy initialized DepegRiskpoolApi
     */
    async riskpoolApi() {
        if (this.doNoUseDirectlydepegRiskpoolApi === undefined) {
            this.doNoUseDirectlydepegRiskpoolApi = new DepegRiskpoolApi(
                (await this.getDepegProductApi()).getDepegRiskpool(), 
                (await this.getDepegProductApi()).getRiskpoolId(), 
                (await this.getDepegProductApi()).getInstanceService(),
                this.usd2Decimals);
            await this.doNoUseDirectlydepegRiskpoolApi.initialize();
        }
        return this.doNoUseDirectlydepegRiskpoolApi;
    }

    async isRiskpoolCapacityAvailable(): Promise<boolean> {
        const contractRiskpoolCap = (await this.riskpoolApi()).getRiskpoolCapitalCap();
        const riskpoolApi = await this.riskpoolApi();
        const capital = await riskpoolApi.getCapital();
        let riskpoolCap = contractRiskpoolCap;
        if (this.riskpoolCapacityLimit !== undefined) {
            riskpoolCap = minBigNumber(contractRiskpoolCap, this.riskpoolCapacityLimit!);
        }
        const remaining = riskpoolCap.sub(capital);
        return this.minInvestedAmount.lte(remaining);
    }

    async riskpoolRemainingCapacity(): Promise<BigNumber> {
        const contractRiskpoolCap = (await this.riskpoolApi()).getRiskpoolCapitalCap();
        let riskpoolCap = contractRiskpoolCap;
        if (this.riskpoolCapacityLimit !== undefined) {
            riskpoolCap = minBigNumber(contractRiskpoolCap, this.riskpoolCapacityLimit!);
        }
        
        const riskpoolApi = await this.riskpoolApi();
        const capital = await riskpoolApi.getCapital();
        return riskpoolCap.sub(capital);
    }

    async isAllowAllAccountsEnabled(): Promise<boolean> {
        return await (await this.riskpoolApi()).isAllowAllAccountsEnabled();
    }

    async isInvestorWhitelisted(walletAddress: string): Promise<boolean> {
        if (this.investorWhitelist !== undefined) {
            console.log("isInvestorWhitelisted", walletAddress, this.investorWhitelist);
            if (this.investorWhitelist.includes(walletAddress)) {
                return true;
            }
        }
        console.log("isInvestorWhitelisted", walletAddress);
        return await (await this.riskpoolApi()).isAllowedAccount(walletAddress);
    }


    async invest(
        name: string,
        lifetime: number,
        investorWalletAddress: string, 
        investedAmount: BigNumber, 
        minSumInsured: BigNumber, 
        maxSumInsured: BigNumber, 
        minDuration: number, 
        maxDuration: number, 
        annualPctReturn: number,
        beforeInvestCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void
    ): Promise<{ status: boolean, bundleId: string | undefined}> {
        console.log("invest", investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        const [tx, receipt] = await (await this.riskpoolApi()).createBundle(
            name, 
            lifetime,
            investorWalletAddress, 
            investedAmount, 
            minSumInsured, 
            maxSumInsured, 
            minDuration, 
            maxDuration, 
            annualPctReturn, 
            beforeInvestCallback, 
            beforeWaitCallback);
        const bundleId = await(await this.riskpoolApi()).extractBundleIdFromApplicationLogs(receipt.logs);
        console.log("bundleId", bundleId);
    
        console.log("tx", tx, "receipt", receipt);
        return { status: receipt.status === 1, bundleId };
    }

    async bundleTokenAddress(): Promise<string> {
        return await(await this.riskpoolApi()).getBundleTokenAddress();
    }

    async fetchAllBundles(handleBundle: (bundle: BundleData) => void): Promise<void> {
        const res = await fetch("/api/bundles/all");
        if (res.status == 200) {
            const bundles = await res.json() as BundleData[];
            bundles.forEach(bundle => handleBundle(bundle));
        } else {
            throw new Error(`invalid response from backend. statuscode ${res.status}. test: ${res.text}`);
        }
    }

    async bundleCount(): Promise<number> {
        return await(await this.riskpoolApi()).getBundleCount();
    }

    async bundleId(idx: number): Promise<number> {
        return await(await this.riskpoolApi()).getBundleId(idx);
    }

    async bundle(bundleId: number, walletAddress?: string): Promise<BundleData|undefined> {
        return await(await this.riskpoolApi()).getBundle(bundleId, walletAddress);
    }

    async maxBundles(): Promise<number> {
        return await(await this.riskpoolApi()).getMaxBundles();
    }

    async activeBundles(): Promise<number> {
        return await(await this.riskpoolApi()).activeBundles();
    }

    async lockBundle(
        bundleId: number,
    ): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).lockBundle(bundleId);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async unlockBundle(
        bundleId: number,
    ): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).unlockBundle(bundleId);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async closeBundle(bundleId: number): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).closeBundle(bundleId);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async burnBundle(bundleId: number): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).burnBundle(bundleId);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async withdrawBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).withdrawBundle(bundleId, amount);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async fundBundle(bundleId: number, amount: BigNumber): Promise<boolean> {
        const [tx, receipt] = await (await this.riskpoolApi()).fundBundle(bundleId, amount);
        console.log("tx", tx, "receipt", receipt);
        return receipt.status === 1;
    }

    async getBundleCapitalCap(): Promise<BigNumber> {
        return (await this.riskpoolApi()).getBundleCapitalCap();
    }

    async getBundleLifetimeMin(): Promise<number> {
        return (await this.riskpoolApi()).getBundleLifetimeMin();
    }

    async getBundleLifetimeMax(): Promise<number> {
        return (await this.riskpoolApi()).getBundleLifetimeMax();
    }

}
