import { BigNumber, ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegRiskpool, IInstanceService } from "../contracts/depeg-contracts";
import { BundleData } from "./bundle_data";
import { getInstanceFromProduct } from "./depeg_product";
import IRiskpoolBuild from '@etherisc/gif-interface/build/contracts/IRiskpool.json'
import { Coder } from "abi-coder";
import { IERC721__factory } from "../contracts/gif-interface";

const IDX_RISKPOOL_ID = 1;
const IDX_TOKEN_ID = 2;
const IDX_STATE = 3;
const IDX_APPLICATION_FILTER = 4;

export async function getBundleData(
    instanceService: IInstanceService, 
    riskpool: DepegRiskpool
): Promise<Array<BundleData>> {
    const activeBundleIds = await riskpool.getActiveBundleIds();

    let bundleData = new Array<BundleData>();

    for (let i = 0; i < activeBundleIds.length; i++) {
        const bundleId = activeBundleIds[i].toNumber();
        console.log('bundleId', bundleId);
        const bundle = await getBundleDataByBundleId(bundleId, instanceService, riskpool);
        bundleData.push(bundle);
    }

    return Promise.resolve(bundleData);
}

export async function getBundleDataByBundleId(bundleId: number, instanceService: IInstanceService, riskpool: DepegRiskpool): Promise<BundleData> {
    const bundle = await instanceService.getBundle(bundleId);
    const riskpoolId = bundle[IDX_RISKPOOL_ID];
    const tokenId = bundle[IDX_TOKEN_ID];
    const applicationFilter = bundle[IDX_APPLICATION_FILTER];
    const [ minSumInsured, maxSumInsured, minDuration, maxDuration, annualPercentageReturn ] = await riskpool.decodeBundleParamsFromFilter(applicationFilter);
    const apr = 100 * annualPercentageReturn.toNumber() / (await riskpool.getApr100PercentLevel()).toNumber();
    const policies = await riskpool.getActivePolicies(bundleId);
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
        tokenId: tokenId.toNumber()
    } as BundleData;
}

export function getBestQuote(
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

export async function createBundle(
    depegProductAddress: string,
    signer: Signer,
    investorWalletAddress: string, 
    investedAmount: number, 
    minSumInsured: number, 
    maxSumInsured: number, 
    minDuration: number, 
    maxDuration: number, 
    annualPctReturn: number,
    beforeWaitCallback?: () => void
): Promise<[ContractTransaction, ContractReceipt]> {
    console.log("createBundle", depegProductAddress, investorWalletAddress, investedAmount, minSumInsured, maxSumInsured, minDuration, maxDuration, annualPctReturn);
    const [ depegProduct, depegRiskpool, riskpoolId, instanceService ] = await getInstanceFromProduct(depegProductAddress, signer);
    const apr100Level = await depegRiskpool.getApr100PercentLevel();
    const apr = annualPctReturn * apr100Level.toNumber() / 100;
    const tx = await depegRiskpool["createBundle(uint256,uint256,uint256,uint256,uint256,uint256)"](
        minSumInsured, 
        maxSumInsured, 
        minDuration * 86400, 
        maxDuration * 86400, 
        apr, 
        investedAmount);
    if (beforeWaitCallback) {
        beforeWaitCallback();
    }
    const receipt = await tx.wait();
    const bundleId = extractBundleIdFromApplicationLogs(receipt.logs);
    console.log("bundleId", bundleId);
    return Promise.resolve([tx, receipt]);
}

export function extractBundleIdFromApplicationLogs(logs: any[]): string|undefined {
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

export async function getBundleTokenAddress(depegProductAddress: string, signer: Signer): Promise<string> {
    console.log("getBundleTokenAddress", depegProductAddress);
    const [ _, _1, _2, instanceService ] = await getInstanceFromProduct(depegProductAddress, signer);
    return await instanceService.getBundleToken();
}

export async function getBundleCount(depegProductContractAddress: string, signer: Signer): Promise<number> {
    console.log("getBundleCount", depegProductContractAddress);
    const [ _, _3, _2, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
    return (await instanceService.bundles()).toNumber();
}

/**
 * Get the bundle data for a given bundle id from the blockchain. 
 * Attention workaround: 
 * This implementation is not very efficient, as it iterates over all bundles
 * and checks if riskpool and token owner are a match. This is due to the fact 
 * that the framework currently does not privide a way to retvieve a list of 
 * nft tokens for a given owner.
 */
export async function getBundle(
    walletAddress: string, 
    depegProductContractAddress: string, 
    bundleTokenAddress: string, 
    signer: Signer, 
    i: number
): Promise<BundleData|undefined> {
    console.log("getBundle", walletAddress, depegProductContractAddress, bundleTokenAddress, i);
    const [ _, depegRiskpool, riskpoolId, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
    const bundle = await getBundleDataByBundleId(i, instanceService, depegRiskpool);
    if (riskpoolId !== bundle.riskpoolId) {
        // bundle does not belong to our riskpool
        return undefined;
    }
    const tokenId = bundle.tokenId;
    const bundleToken = IERC721__factory.connect(bundleTokenAddress, signer);
    const owner = await bundleToken.ownerOf(tokenId);
    if (owner !== walletAddress) {
        // owner mismatch
        return undefined;
    }
    return bundle;
}