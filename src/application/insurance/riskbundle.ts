import { BigNumber } from "ethers";
import { DepegRiskpool, IInstanceService, IRiskpool } from "../../contracts/depeg-contracts";
import { IRiskpoolService } from "../../contracts/gif-interface/IRiskpoolService";
import { BundleData } from "./bundle_data";

const IDX_APPLICATION_FILTER = 4;

export async function getBundleData(
        instanceService: IInstanceService, 
        riskpoolId: number, // this could be retrieved from the IRiskpool contract, but that would require an additonal chain call which we can avoid
        riskpool: DepegRiskpool
        ): Promise<Array<BundleData>> {
    // riskpoolId = riskpool.getId()
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