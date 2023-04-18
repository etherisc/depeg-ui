import { BigNumber } from "ethers";
import { ComponentState } from "../types/component_state";
import { ApplicationGasless } from "./application_gasless";
import { ApplicationApi } from "./backend_api";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { APPLICATION_STATE_PENDING_MINING, PolicyData } from "./policy_data";
import { DepegRiskpoolApi } from "./riskpool_api";
import { PendingApplication } from "../utils/pending_application";

export class ApplicationApiSmartContract implements ApplicationApi {
    private depegProductApi: DepegProductApi;
    private doNoUseDirectlyDepegRiskpoolApi?: DepegRiskpoolApi;
    private applicationGasless?: ApplicationGasless;
    protectedAmountMin: BigNumber;
    protectedAmountMax: BigNumber;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    usd2decimals: number;
    
    constructor(depegProductApi: DepegProductApi, protectedAmountMin: BigNumber, protectedAmountMax: BigNumber, coverageDurationDaysMin: number, coverageDurationDaysMax: number, usd2decimals: number) {
        this.protectedAmountMin = protectedAmountMin;
        this.protectedAmountMax = protectedAmountMax;
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
            this.applicationGasless = new ApplicationGasless(this.depegProductApi.getSigner());
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
            if (BigNumber.from(bundle.minProtectedAmount).gt(capacity)) {
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

    async calculatePremium(walletAddress: string, protectedAmount: BigNumber, coverageDurationSeconds: number, bundle: BundleData): Promise<BigNumber> {
        console.log("calculatePremium", walletAddress, protectedAmount.toNumber(), coverageDurationSeconds);
        const depegProduct = (await this.getDepegProductApi())!.getDepegProduct();
        
        const protectedAmountFactor = (await this.riskpoolApi()).getProtectedAmountFactor();
        const sumInsured = protectedAmount.div(protectedAmountFactor);
        
        // the premium is calculated in the smart contract based on the sum insured (and not the protected amount)
        const netPremium = (await depegProduct.calculateNetPremium(sumInsured, coverageDurationSeconds, bundle.id));
        console.log("netPremium", netPremium);
        const premium = (await depegProduct.calculatePremium(netPremium));
        console.log("premium", premium.toNumber());
        return premium;
    }

    async applyForPolicy(
            walletAddress: string, 
            protectedAmount: BigNumber, 
            coverageDurationSeconds: number,
            bundleId: number,
            gasless: boolean,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ): Promise<{ status: boolean, processId: string|undefined}> {
        if (gasless) {
            return await this.applicationGasless!.applyForPolicyGasless(walletAddress, protectedAmount, coverageDurationSeconds, bundleId, beforeApplyCallback, beforeWaitCallback);
        } else {
            return await this.applyForPolicyOnChain(walletAddress, protectedAmount, coverageDurationSeconds, bundleId, beforeApplyCallback, beforeWaitCallback);
        }
    }

    async applyForPolicyOnChain(
        walletAddress: string, 
        protectedAmount: BigNumber, 
        coverageDurationSeconds: number,
        bundleId: number,
        beforeApplyCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<{ status: boolean, processId: string|undefined}> {
        console.log("applyForPolicyOnChain", walletAddress, protectedAmount, coverageDurationSeconds, bundleId);
        const [tx, receipt] = await (await this.getDepegProductApi())!.applyForDepegPolicy(walletAddress, protectedAmount, coverageDurationSeconds, bundleId, beforeApplyCallback, beforeWaitCallback);
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

    async getProductComponentState(): Promise<ComponentState> {
        return (await this.getDepegProductApi())!.getComponentState();
    }

    async fetchPending(walletAddress: string, handlePending: (application: PolicyData) => Promise<void>): Promise<void> {
        const res = await fetch("/api/application?address=" + walletAddress);
        if (res.status != 200) {
            throw new Error(`invalid response from backend. statuscode ${res.status}. test: ${res.text}`);
            return;
        }

        const pendingApplications = await res.json() as PendingApplication[];
        console.log("pendingApplications", pendingApplications.length);
        const signer = (await this.getDepegProductApi()).getSigner();

        for (const application of pendingApplications) {
            const trx = await signer.provider!.getTransaction(application.transactionHash);
            // TODO: don't check mined, check if contained in existing policies
            const isMined = trx.blockHash !== null;
            if (isMined) {
                console.log("Transaction already mined, skipping", application.transactionHash);
                continue;
            }

            const pd = {
                id: application.transactionHash,
                policyHolder: application.policyHolder,
                protectedWallet: application.protectedWallet,
                applicationState: APPLICATION_STATE_PENDING_MINING, 
                policyState: 0, 
                payoutState: 0,
                createdAt: parseInt((new Date(application.timestamp).valueOf() / 1000).toFixed(0)),
                duration: application.duration,
                premium: BigNumber.from(0).toString(),
                protectedAmount: application.protectedBalance,
                payoutCap: BigNumber.from(0).toString(),
                isAllowedToClaim: false,
                claim: undefined,
                transactionHash: application.transactionHash,
            } as PolicyData
            await handlePending(pd);
        }
    }

}
