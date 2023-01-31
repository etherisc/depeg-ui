import { BigNumber, ethers } from "ethers";
import { NoBundleFoundError, BalanceTooSmallError } from "../utils/error";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { hasBalance } from "./erc20";
import { ApplicationApi } from "./backend_api";
import { DepegRiskpoolApi } from "./riskpool_api";

export class ApplicationApiSmartContract implements ApplicationApi {
    private depegProductApi: DepegProductApi;
    private doNoUseDirectlyDepegRiskpoolApi?: DepegRiskpoolApi;
    insuredAmountMin: BigNumber;
    insuredAmountMax: BigNumber;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    
    constructor(depegProductApi: DepegProductApi, insuredAmountMin: BigNumber, insuredAmountMax: BigNumber, coverageDurationDaysMin: number, coverageDurationDaysMax: number) {
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
    
    async getRiskBundles(handleBundle: (bundle: BundleData) => void) {
        if ((await this.getDepegProductApi())!.isVoidSigner()) {
            return;
        }

        console.log("retrieving risk bundles from smart contract");
        console.log(`riskpoolId: ${(await this.getDepegProductApi())!.getRiskpoolId()}`);
        const bundles = await (await this.riskpoolApi()).getBundleData();

        for (const bundle of bundles) {
            // less capacity then min protected amount
            if (BigNumber.from(bundle.minSumInsured).gt(bundle.capacity)) {
                continue;
            }
            const capitalSupport = bundle.capitalSupport;
            if (capitalSupport !== undefined) {
                // console.log("bundleid", bundle.id, "locked", bundle.locked, "capitalSupport", capitalSupport.toString());
                // if supported capital is defined, then only bundles with locked capital less than the capital support are used
                if (BigNumber.from(bundle.locked).gte(BigNumber.from(capitalSupport))) {
                    continue;
                }
                console.log("stakes available", bundle.id);
            }
            handleBundle(bundle);
        }
    }

    async calculatePremium(walletAddress: string, insuredAmount: BigNumber, coverageDurationDays: number, bundles: Array<BundleData>): Promise<[BigNumber, BundleData]> {
        if ((await this.getDepegProductApi())!.isVoidSigner()) {
            console.log('no chain connection, no premium calculation');
            return Promise.resolve([BigNumber.from(0), {} as BundleData]);
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
        const netPremium = (await depegProduct.calculateNetPremium(insuredAmount, durationSecs, bestBundle.id));
        console.log("netPremium", netPremium);
        const premium = (await depegProduct.calculatePremium(netPremium));
        console.log("premium", premium);

        if (! await hasBalance(walletAddress, premium, await depegProduct.getToken(), (await this.getDepegProductApi())!.getSigner())) {
            throw new BalanceTooSmallError();
        }

        return [premium, bestBundle];
    }

    async applyForPolicy(
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationDays: number,
            premium: BigNumber,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ): Promise<{ status: boolean, processId: string|undefined}> {
        console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
        const [tx, receipt] = await (await this.getDepegProductApi())!.applyForDepegPolicy(walletAddress, insuredAmount, coverageDurationDays, premium, beforeApplyCallback, beforeWaitCallback);
        const processId = (await this.getDepegProductApi())!.extractProcessIdFromApplicationLogs(receipt.logs);
        console.log(`processId: ${processId}`);
        return {
            status: receipt.status === 1, 
            processId
        };
    }

    async lastBlockTimestamp(): Promise<number> {
        const blockNumber = await this.depegProductApi.getSigner().provider?.getBlockNumber() ?? 0;
        const block = await this.depegProductApi.getSigner().provider?.getBlock(blockNumber);
        return block?.timestamp ?? 0;
    }

}
