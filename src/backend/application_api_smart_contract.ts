import { BigNumber } from "ethers";
import { ApplicationApi } from "./backend_api";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { DepegRiskpoolApi } from "./riskpool_api";

export class ApplicationApiSmartContract implements ApplicationApi {
    private depegProductApi: DepegProductApi;
    private doNoUseDirectlyDepegRiskpoolApi?: DepegRiskpoolApi;
    insuredAmountMin: BigNumber;
    insuredAmountMax: BigNumber;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    usd2decimals: number;
    
    constructor(depegProductApi: DepegProductApi, insuredAmountMin: BigNumber, insuredAmountMax: BigNumber, coverageDurationDaysMin: number, coverageDurationDaysMax: number, usd2decimals: number) {
        this.insuredAmountMin = insuredAmountMin;
        this.insuredAmountMax = insuredAmountMax;
        this.coverageDurationDaysMin = coverageDurationDaysMin;
        this.coverageDurationDaysMax = coverageDurationDaysMax;
        this.depegProductApi = depegProductApi;
        this.usd2decimals = usd2decimals;
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
                (await this.getDepegProductApi()).getInstanceService(),
                this.usd2decimals,
                );
            await this.doNoUseDirectlyDepegRiskpoolApi.initialize();
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
            const capacity = BigNumber.from(bundle.capacity);
            // ignore bundles with no capacity
            if (capacity.lte(0)) {
                continue;
            }
            // ignore bundles with less capacity then min protected amount (inconsistent)
            if (BigNumber.from(bundle.minSumInsured).gt(capacity)) {
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

    async fetchStakeableRiskBundles(handleBundle: (bundle: BundleData) => void): Promise<void> {
        const res = await fetch("/api/bundles/active");
        if (res.status == 200) {
            const bundles = await res.json() as BundleData[];
            bundles.forEach(bundle => handleBundle(bundle));
        } else {
            throw new Error(`invalid response from backend. statuscode ${res.status}. test: ${res.text}`);
        }
    }   

    async calculatePremium(walletAddress: string, insuredAmount: BigNumber, coverageDurationSeconds: number, bundle: BundleData): Promise<BigNumber> {
        console.log("calculatePremium", walletAddress, insuredAmount.toNumber(), coverageDurationSeconds);
        
        const depegProduct = (await this.getDepegProductApi())!.getDepegProduct();
        const netPremium = (await depegProduct.calculateNetPremium(insuredAmount, coverageDurationSeconds, bundle.id));
        console.log("netPremium", netPremium);
        const premium = (await depegProduct.calculatePremium(netPremium));
        console.log("premium", premium.toNumber());
        return premium;
    }

    async applyForPolicy(
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationSeconds: number,
            bundleId: number,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ): Promise<{ status: boolean, processId: string|undefined}> {
        console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationSeconds, bundleId);
        const [tx, receipt] = await (await this.getDepegProductApi())!.applyForDepegPolicy(walletAddress, insuredAmount, coverageDurationSeconds, bundleId, beforeApplyCallback, beforeWaitCallback);
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

    async claim(
        processId: string,
        beforeTrxCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<{ status: boolean, claimId: string|undefined}> {
        const [tx, receipt] = await (await this.getDepegProductApi())!.claim(processId, beforeTrxCallback, beforeWaitCallback);
        const claimId = (await this.getDepegProductApi())!.extractClaimIdFromLogs(receipt.logs);
        console.log(`claimId: ${claimId}`);
        return {
            status: receipt.status === 1, 
            claimId
        };
    }

}
