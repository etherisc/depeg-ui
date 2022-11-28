import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegRiskpool, IInstanceService } from "../contracts/depeg-contracts";
import { BundleData } from "./bundle_data";
import IRiskpoolBuild from '@etherisc/gif-interface/build/contracts/IRiskpool.json'
import { Coder } from "abi-coder";
import { IERC721__factory } from "../contracts/gif-interface";

const IDX_RISKPOOL_ID = 1;
const IDX_TOKEN_ID = 2;
const IDX_STATE = 3;
const IDX_APPLICATION_FILTER = 4;
const IDX_CREATED_AT = 8;

export class DepegRiskpoolApi {

    private depegRiskpool: DepegRiskpool;
    private signer?: Signer;
    private riskpoolId: number;
    private instanceService: IInstanceService;

    constructor(
        riskpool: DepegRiskpool,
        riskpoolId: number,
        instanceService: IInstanceService,
        // signer: Signer,
    ) {
        this.depegRiskpool = riskpool;
        this.signer = riskpool.signer;
        this.riskpoolId = riskpoolId;
        this.instanceService = instanceService;
    }

    async getBundleData(
    ): Promise<Array<BundleData>> {
        const activeBundleIds = await this.depegRiskpool.getActiveBundleIds();
    
        let bundleData = new Array<BundleData>();
    
        for (let i = 0; i < activeBundleIds.length; i++) {
            const bundleId = activeBundleIds[i].toNumber();
            console.log('bundleId', bundleId);
            const bundle = await this.getBundleDataByBundleId(bundleId);
            bundleData.push(bundle);
        }
    
        return Promise.resolve(bundleData);
    }
    
    async getBundleDataByBundleId(bundleId: number): Promise<BundleData> {
        const bundle = await this.instanceService.getBundle(bundleId);
        const riskpoolId = bundle[IDX_RISKPOOL_ID];
        const tokenId = bundle[IDX_TOKEN_ID];
        const applicationFilter = bundle[IDX_APPLICATION_FILTER];
        const [ minSumInsured, maxSumInsured, minDuration, maxDuration, annualPercentageReturn ] = await this.depegRiskpool.decodeBundleParamsFromFilter(applicationFilter);
        const apr = 100 * annualPercentageReturn.toNumber() / (await this.depegRiskpool.getApr100PercentLevel()).toNumber();
        const policies = await this.depegRiskpool.getActivePolicies(bundleId);
        const state = bundle[IDX_STATE];
    
        return {
            riskpoolId: riskpoolId.toNumber(),
            bundleId: bundleId,
            apr: apr,
            minSumInsured: minSumInsured.toNumber(),
            maxSumInsured: maxSumInsured.toNumber(),
            minDuration: minDuration.toNumber(),
            maxDuration: maxDuration.toNumber(),
            capital: bundle[5].toNumber(),
            locked: bundle[6].toNumber(),
            capacity: bundle[5].toNumber() - bundle[6].toNumber(),
            policies: policies.toNumber(),
            state: state,
            tokenId: tokenId.toNumber(),
            createdAt: bundle[IDX_CREATED_AT].toNumber(),
        } as BundleData;
    }
    
    getBestQuote(
        bundleData: Array<BundleData>, 
        sumInsured: number, 
        duration: number
    ): BundleData {
        return bundleData.reduce((best, bundle) => {
            if (sumInsured < bundle.minSumInsured) {
                return best;
            }
            if (sumInsured > bundle.maxSumInsured) {
                return best;
            }
            if (duration < bundle.minDuration) {
                return best;
            }
            if (duration > bundle.maxDuration) {
                return best;
            }
            if (best.apr < bundle.apr) {
                return best;
            }
            if (sumInsured > bundle.capacity) {
                return best;
            }
            return bundle;
        }, { apr: 100, minDuration: Number.MAX_VALUE, maxDuration: Number.MIN_VALUE, minSumInsured: Number.MAX_VALUE, maxSumInsured: Number.MIN_VALUE } as BundleData);
    }
    
    async createBundle(
        investorWalletAddress: string, 
        investedAmount: number, 
        minSumInsured: number, 
        maxSumInsured: number, 
        minDuration: number, 
        maxDuration: number, 
        annualPctReturn: number,
        beforeInvestCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("createBundle", investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        const apr100Level = await this.depegRiskpool.getApr100PercentLevel();
        const apr = annualPctReturn * apr100Level.toNumber() / 100;
        const riskpoolAddress = this.depegRiskpool.address;
        if (beforeInvestCallback) {
            beforeInvestCallback(riskpoolAddress);
        }
        const tx = await this.depegRiskpool["createBundle(uint256,uint256,uint256,uint256,uint256,uint256)"](
            minSumInsured, 
            maxSumInsured, 
            minDuration * 86400, 
            maxDuration * 86400, 
            apr, 
            investedAmount);
        if (beforeWaitCallback !== undefined) {
            beforeWaitCallback(riskpoolAddress);
        }
        const receipt = await tx.wait();
        const bundleId = this.extractBundleIdFromApplicationLogs(receipt.logs);
        console.log("bundleId", bundleId);
        return Promise.resolve([tx, receipt]);
    }
    
    extractBundleIdFromApplicationLogs(logs: any[]): string|undefined {
        const riskpoolAbiCoder = new Coder(IRiskpoolBuild.abi);
        let bundleId = undefined;
    
        logs.forEach(log => {
            try {
                const evt = riskpoolAbiCoder.decodeEvent(log.topics, log.data);
                console.log(evt);
                if (evt.name === 'LogRiskpoolBundleCreated') {
                    // console.log(evt);
                    // @ts-ignore
                    bundleId = evt.values.bundleId.toString();
                }
            } catch (e) {
                console.log(e);
            }
        });
    
        return bundleId;
    }
    
    async getBundleTokenAddress(): Promise<string> {
        console.log("getBundleTokenAddress");
        return await this.instanceService.getBundleToken();
    }
    
    async getBundleCount(): Promise<number> {
        console.log("getBundleCount");
        return (await this.instanceService.bundles()).toNumber();
    }
    
    /**
     * Get the bundle data for a given bundle id from the blockchain. 
     * Attention workaround: 
     * This implementation is not very efficient, as it iterates over all bundles
     * and checks if riskpool and token owner are a match. This is due to the fact 
     * that the framework currently does not privide a way to retvieve a list of 
     * nft tokens for a given owner.
     */
    async getBundle(
        walletAddress: string, 
        bundleTokenAddress: string, 
        i: number
    ): Promise<BundleData|undefined> {
        console.log("getBundle", walletAddress, bundleTokenAddress, i);
        const bundle = await this.getBundleDataByBundleId(i);
        console.log(bundle);
        if (this.riskpoolId !== bundle.riskpoolId) {
            console.log("riskpoolId mismatch");
            // bundle does not belong to our riskpool
            return undefined;
        }
        const tokenId = bundle.tokenId;
        const bundleToken = IERC721__factory.connect(bundleTokenAddress, this.signer!);
        const owner = await bundleToken.ownerOf(tokenId);
        if (owner !== walletAddress) {
            // owner mismatch
            console.log("owner mismatch");
            return undefined;
        }
        return bundle;
    }

}

