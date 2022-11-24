import { BigNumber, ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegRiskpool, IInstanceService, IRiskpool } from "../../contracts/depeg-contracts";
import { BundleData } from "./bundle_data";
import { getInstanceFromProduct } from "./depeg_product";
import IRiskpoolBuild from '@etherisc/gif-interface/build/contracts/IRiskpool.json'
import { Coder } from "abi-coder";

const IDX_APPLICATION_FILTER = 4;

export async function getBundleData(
    instanceService: IInstanceService, 
    riskpoolId: number, // this could be retrieved from the IRiskpool contract, but that would require an additonal chain call which we can avoid
    riskpool: DepegRiskpool
): Promise<Array<BundleData>> {
    const activeBundleIds = await riskpool.getActiveBundleIds();

    let bundleData = new Array<BundleData>();

    for (let i = 0; i < activeBundleIds.length; i++) {
        const bundleId = activeBundleIds[i];
        console.log('bundleId', bundleId.toNumber());
        const bundle = await instanceService.getBundle(bundleId);
        const applicationFilter = bundle[IDX_APPLICATION_FILTER];
        const [ minSumInsured, maxSumInsured, minDuration, maxDuration, annualPercentageReturn ] = await riskpool.decodeBundleParamsFromFilter(applicationFilter);
        const apr = 100 * annualPercentageReturn.toNumber() / (await riskpool.getApr100PercentLevel()).toNumber();
        const policies = await riskpool.getActivePolicies(bundleId);

        bundleData.push({
            idx: i,
            riskpoolId: riskpoolId,
            bundleId: bundleId.toNumber(),
            apr: apr,
            minSumInsured: minSumInsured.toNumber(),
            maxSumInsured: maxSumInsured.toNumber(),
            minDuration: minDuration.toNumber(),
            maxDuration: maxDuration.toNumber(),
            capital: bundle[5].toNumber(),
            locked: bundle[6].toNumber(),
            capacity: bundle[5].toNumber() - bundle[6].toNumber(),
            policies: policies.toNumber()
        });
    }

    return Promise.resolve(bundleData);
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
    }, { idx: -1, apr: 100, minDuration: Number.MAX_VALUE, maxDuration: Number.MIN_VALUE, minSumInsured: Number.MAX_VALUE, maxSumInsured: Number.MIN_VALUE } as BundleData);
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
