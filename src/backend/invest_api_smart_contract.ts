import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { InvestApi } from "./insurance_api";
import { DepegRiskpoolApi } from "./riskpool_api";

export class InvestApiSmartContract implements InvestApi {
    private doNoUseDirectlydepegRiskpoolApi?: DepegRiskpoolApi;
    private depegProductApi: DepegProductApi;

    minInvestedAmount: number;
    maxInvestedAmount: number;
    minSumInsured: number;
    maxSumInsured: number;
    minCoverageDuration: number;
    maxCoverageDuration: number;
    annualPctReturn: number;
    maxAnnualPctReturn: number;

    constructor(depegProductApi: DepegProductApi, minInvestedAmount: number, maxInvestedAmount: number, minSumInsured: number, maxSumInsured: number, minCoverageDuration: number, maxCoverageDuration: number, annualPctReturn: number, maxAnnualPctReturn: number) {
        this.minInvestedAmount = minInvestedAmount;
        this.maxInvestedAmount = maxInvestedAmount;
        this.minSumInsured = minSumInsured;
        this.maxSumInsured = maxSumInsured;
        this.minCoverageDuration = minCoverageDuration;
        this.maxCoverageDuration = maxCoverageDuration;
        this.annualPctReturn = annualPctReturn;
        this.maxAnnualPctReturn = maxAnnualPctReturn;
        this.depegProductApi = depegProductApi;
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
                (await this.getDepegProductApi()).getInstanceService());
        }
        return this.doNoUseDirectlydepegRiskpoolApi;
    }

    async invest(
        investorWalletAddress: string, 
        investedAmount: number, 
        minSumInsured: number, 
        maxSumInsured: number, 
        minDuration: number, 
        maxDuration: number, 
        annualPctReturn: number,
        beforeInvestCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void
    ): Promise<boolean> {
        console.log("invest", investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        const [tx, receipt] = await (await this.riskpoolApi()).createBundle(
            investorWalletAddress, 
            investedAmount, 
            minSumInsured, 
            maxSumInsured, 
            minDuration, 
            maxDuration, 
            annualPctReturn, 
            beforeInvestCallback, 
            beforeWaitCallback);
        console.log("tx", tx, "receipt", receipt);
        return Promise.resolve(receipt.status === 1);
    }

    async bundleTokenAddress(): Promise<string> {
        return await(await this.riskpoolApi()).getBundleTokenAddress();
    }

    async bundleCount(): Promise<number> {
        return await(await this.riskpoolApi()).getBundleCount();
    }

    async bundleId(idx: number): Promise<number> {
        return await(await this.riskpoolApi()).getBundleId(idx);
    }

    async bundle(walletAddress: string, bundleTokenAddress: string, bundleId: number): Promise<BundleData|undefined> {
        return await(await this.riskpoolApi()).getBundle(walletAddress, bundleTokenAddress, bundleId);
    }

}
