import { BigNumber, ethers } from "ethers";
import { NoBundleFoundError, BalanceTooSmallError } from "../utils/error";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { hasBalance } from "./erc20";
import { ApplicationApi } from "./insurance_api";
import { DepegRiskpoolApi } from "./riskpool_api";

export class ApplicationApiSmartContract implements ApplicationApi {
    private depegProductApi: DepegProductApi;
    private doNoUseDirectlyDepegRiskpoolApi?: DepegRiskpoolApi;
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    
    constructor(depegProductApi: DepegProductApi, insuredAmountMin: number, insuredAmountMax: number, coverageDurationDaysMin: number, coverageDurationDaysMax: number) {
        this.insuredAmountMin = insuredAmountMin;
        this.insuredAmountMax = insuredAmountMax;
        this.coverageDurationDaysMin = coverageDurationDaysMin;
        this.coverageDurationDaysMax = coverageDurationDaysMax;
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

    async riskpoolApi(): Promise<DepegRiskpoolApi> {
        if (this.doNoUseDirectlyDepegRiskpoolApi === undefined) {
            this.doNoUseDirectlyDepegRiskpoolApi = new DepegRiskpoolApi(
                (await this.getDepegProductApi()).getDepegRiskpool(), 
                (await this.getDepegProductApi()).getRiskpoolId(), 
                (await this.getDepegProductApi()).getInstanceService()
                );
        }
        return this.doNoUseDirectlyDepegRiskpoolApi;
    }
    
    async getRiskBundles() {
        if ((await this.getDepegProductApi())!.isVoidSigner()) {
            return Promise.resolve([]);
        }

        console.log("retrieving risk bundles from smart contract");
        console.log(`riskpoolId: ${(await this.getDepegProductApi())!.getRiskpoolId()}`);
        return await (await this.riskpoolApi()).getBundleData();
    }

    async calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number, bundles: Array<BundleData>): Promise<number> {
        if ((await this.getDepegProductApi())!.isVoidSigner()) {
            console.log('no chain connection, no premium calculation');
            return Promise.resolve(0);
        }

        const durationSecs = coverageDurationDays * 24 * 60 * 60;
        console.log("calculatePremium", walletAddress, insuredAmount, coverageDurationDays);
        console.log("bundleData", bundles);
        const bestBundle = (await this.riskpoolApi()).getBestQuote(bundles, insuredAmount, durationSecs, await this.lastBlockTimestamp());
        if (bestBundle.minDuration == Number.MAX_VALUE) { 
            throw new NoBundleFoundError();
        }
        
        // TODO avoid this
        const depegProduct = (await this.getDepegProductApi())!.getDepegProduct();

        console.log("bestBundle", bestBundle);
        const netPremium = (await depegProduct.calculateNetPremium(insuredAmount, durationSecs, bestBundle.id)).toNumber();
        console.log("netPremium", netPremium);
        const premium = (await depegProduct.calculatePremium(netPremium)).toNumber();
        console.log("premium", premium);

        if (! await hasBalance(walletAddress, premium, await depegProduct.getToken(), (await this.getDepegProductApi())!.getSigner())) {
            throw new BalanceTooSmallError();
        }

        return Promise.resolve(premium);
    }

    async applyForPolicy(
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number,
            premium: number,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ) {
        console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
        const [tx, receipt] = await (await this.getDepegProductApi())!.applyForDepegPolicy(insuredAmount, coverageDurationDays, premium, beforeApplyCallback, beforeWaitCallback);
        let processId = (await this.getDepegProductApi())!.extractProcessIdFromApplicationLogs(receipt.logs);
        console.log(`processId: ${processId}`);
        return Promise.resolve(true);
    }

    async lastBlockTimestamp(): Promise<number> {
        const blockNumber = await this.depegProductApi.getSigner().provider?.getBlockNumber() ?? 0;
        const block = await this.depegProductApi.getSigner().provider?.getBlock(blockNumber);
        return block?.timestamp ?? 0;
    }

}
