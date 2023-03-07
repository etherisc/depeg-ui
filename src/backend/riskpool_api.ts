import IRiskpoolBuild from '@etherisc/gif-interface/build/contracts/IRiskpool.json';
import { Coder } from "abi-coder";
import { BigNumber, ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegRiskpool, IInstanceService } from "../contracts/depeg-contracts";
import { finish, start, waitingForTransaction, waitingForUser } from "../redux/slices/transaction";
import { store } from "../redux/store";
import { TrxType } from "../types/trxtype";
import { TransactionFailedError } from "../utils/error";
import { isStakingSupported } from "../utils/staking";
import { BundleData, MAX_BUNDLE } from "./bundle_data";
import StakingApi from "./staking_api";

export class DepegRiskpoolApi {

    private depegRiskpool: DepegRiskpool;
    private signer?: Signer;
    private riskpoolId: number;
    private instanceService: IInstanceService;
    private stakingApi?: StakingApi;

    constructor(
        riskpool: DepegRiskpool,
        riskpoolId: number,
        instanceService: IInstanceService,
        usd2Decimals: number,
        // signer: Signer,
    ) {
        this.depegRiskpool = riskpool;
        this.signer = riskpool.signer;
        this.riskpoolId = riskpoolId;
        this.instanceService = instanceService;


        const stakingAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
        if (stakingAddress !== undefined) {
            this.stakingApi = new StakingApi(stakingAddress, riskpool.signer, instanceService);
        }
    }

    async initialize(): Promise<void> {
        if (this.stakingApi !== undefined) {
            await this.stakingApi.initialize();
        }
    }

    async getCapital(): Promise<BigNumber> {
        return await this.depegRiskpool.getCapital();
    }

    async getBundleData(
    ): Promise<Array<BundleData>> {
        const numBundles = (await this.depegRiskpool.bundles()).toNumber();
        console.log("number of bundles: " + numBundles);
    
        let bundleData = new Array<BundleData>();
    
        for (let i = 0; i < numBundles; i++) {
            const bundleId = (await this.depegRiskpool.getBundleId(i)).toNumber();
            console.log('bundleId', bundleId);
            const bundle = await this.getBundleDataByBundleId(bundleId);
            bundleData.push(bundle);
        }
    
        return Promise.resolve(bundleData);
    }
    
    async getBundleDataByBundleId(bundleId: number): Promise<BundleData> {
        const { name, state, tokenId, owner, lifetime, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPercentageReturn, capital, lockedCapital, createdAt, balance } = await this.depegRiskpool.getBundleInfo(bundleId);
        const apr = 100 * annualPercentageReturn.toNumber() / (await this.depegRiskpool.getApr100PercentLevel()).toNumber();
        const policies = await this.depegRiskpool.getActivePolicies(bundleId);
        let capitalSupport = undefined;
    
        if (this.stakingApi !== undefined) {
            capitalSupport = await this.stakingApi.getSupportedCapital(this.riskpoolId, bundleId);
        }

        return {
            id: bundleId,
            riskpoolId: this.riskpoolId,
            owner: owner,
            apr: apr,
            minSumInsured: minSumInsured.toString(),
            maxSumInsured: maxSumInsured.toString(),
            minDuration: minDuration.toNumber(),
            maxDuration: maxDuration.toNumber(),
            balance: balance.toString(),
            capital: capital.toString(),
            locked: lockedCapital.toString(),
            capitalSupport: capitalSupport?.toString(),
            capacity: capital.sub(lockedCapital).toString(),
            policies: policies.toNumber(),
            state: state,
            tokenId: tokenId.toNumber(),
            createdAt: createdAt.toNumber(),
            name: name,
            lifetime: lifetime.toString(),
        } as BundleData;
    }
    
    getBestQuote(
        bundleData: Array<BundleData>, 
        sumInsured: BigNumber, 
        duration: number,
        lastBlockTimestamp: number
    ): BundleData {
        return bundleData.reduce((best, bundle) => {
            if (lastBlockTimestamp > (bundle.createdAt + parseInt(bundle.lifetime))) {
                return best;
            }
            const minSumInsured = BigNumber.from(bundle.minSumInsured);
            const maxSumInsured = BigNumber.from(bundle.maxSumInsured);
            if (sumInsured.lt(minSumInsured)) {
                console.log("sumInsured less that min sum insured", sumInsured, bundle);
                return best;
            }
            if (sumInsured.gt(maxSumInsured)) {
                console.log("sumInsured greater that max sum insured", sumInsured, bundle);
                return best;
            }
            if (duration < bundle.minDuration) {
                console.log("duration less that min duration", duration, bundle);
                return best;
            }
            if (duration > bundle.maxDuration) {
                console.log("duration greater that max duration", duration, bundle);
                return best;
            }
            if (best.apr < bundle.apr) {
                console.log("bundle apr larger than best apr so far (best, bundle)", best, bundle);
                return best;
            }
            const capacity = BigNumber.from(bundle.capacity);
            if (sumInsured.gt(capacity)) {
                console.log("sumInsured greater than capacity", sumInsured, bundle);
                return best;
            }
            if (isStakingSupported) {
                if (bundle.capitalSupport === undefined) {
                    console.log("no stakes defined on bundle", bundle);
                    return best;
                }
                const lockedCapital = BigNumber.from(bundle.locked);
                const stakesRemaining = BigNumber.from(bundle.capitalSupport).sub(lockedCapital)
                if (stakesRemaining.lte(0)) {
                    console.log("no stakes remaining on bundle", bundle);
                    return best;
                }
            }
            console.log("bundle selected", bundle);
            return bundle;
        }, MAX_BUNDLE);
    }
    
    async createBundle(
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
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("createBundle", investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
        const apr100Level = await this.depegRiskpool.getApr100PercentLevel();
        const apr = annualPctReturn * apr100Level.toNumber() / 100;
        const riskpoolAddress = this.depegRiskpool.address;
        if (beforeInvestCallback) {
            beforeInvestCallback(riskpoolAddress);
        }
        try {
            const tx = await this.depegRiskpool["createBundle(string,uint256,uint256,uint256,uint256,uint256,uint256,uint256)"](
                name,
                lifetime,
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
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while creating bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        }
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
        return (await this.depegRiskpool.bundles()).toNumber();
    }
    
    async getBundleId(idx: number): Promise<number> {
        // console.log("getBundleId");
        return (await this.depegRiskpool.getBundleId(idx)).toNumber();
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
        bundleId: number,
        walletAddress?: string, 
    ): Promise<BundleData|undefined> {
        // console.log("getBundle", bundleId);
        const bundle = await this.getBundleDataByBundleId(bundleId);
        // console.log(bundle);
        if (walletAddress !== undefined && bundle.owner !== walletAddress) {
            // owner mismatch
            console.log("owner mismatch");
            return undefined;
        }
        return bundle;
    }

    async activeBundles(): Promise<number> {
        return (await this.instanceService.activeBundles(this.riskpoolId)).toNumber();
    }

    async getMaxBundles(): Promise<number> {
        return (await this.instanceService.getMaximumNumberOfActiveBundles(this.riskpoolId)).toNumber();
    }

    async lockBundle(
        bundleId: number,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - lockBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_LOCK }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.lockBundle(bundleId);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while locking bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

    async unlockBundle(
        bundleId: number,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - unlockBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_UNLOCK }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.unlockBundle(bundleId);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while unlocking bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

    async closeBundle(
        bundleId: number,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - closeBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_CLOSE }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.closeBundle(bundleId);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while closing bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

    async burnBundle(
        bundleId: number,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - burnBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_BURN }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.burnBundle(bundleId);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while burning bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

    async withdrawBundle(
        bundleId: number,
        amount: BigNumber,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - withdrawBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_WITHDRAW }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.defundBundle(bundleId, amount);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while withdrawing from bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

    async fundBundle(
        bundleId: number,
        amount: BigNumber,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        console.log("riskpoolapi - fundBundle");
        const riskpoolAddress = this.depegRiskpool.address;
        store.dispatch(start({ type: TrxType.BUNDLE_FUND }));
        store.dispatch(waitingForUser({ active: true, params: { address: riskpoolAddress }}));
        try {
            const tx = await this.depegRiskpool.fundBundle(bundleId, amount);
            store.dispatch(waitingForTransaction({ active: true, params: { address: riskpoolAddress }}));
            const receipt = await tx.wait();
            return Promise.resolve([tx, receipt]);
        } catch (e) {
            console.log("caught error while withdrawing from bundle: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        } finally {
            store.dispatch(finish());
        }
    }

}

