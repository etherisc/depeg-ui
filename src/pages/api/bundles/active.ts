import { BigNumber } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { minBigNumber } from "../../../utils/bignumber";
import { getBackendVoidSigner, getLastBlockTimestamp } from "../../../utils/chain";
import { redisClient } from "../../../utils/redis";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("getting active bundles from redis");
    const bundlesjson = await redisClient.get("bundles");
    
    if (bundlesjson == null) {
        res.status(200).json([]);
        return;
    }        

    const bundles = JSON.parse(bundlesjson) as Array<BundleData>;
    const lastBlockTimestamp = await getLastBlockTimestamp(await getBackendVoidSigner());

    res.status(200).json(bundles.filter(bundle => {
        // ignore bundles with state not active
        if (bundle.state !== 0) {
            console.log("bundle not active", bundle.id);
            return false;
        }

        // ignore expired bundles
        if (lastBlockTimestamp > (bundle.createdAt + parseInt(bundle.lifetime))) {
            console.log("bundle expired", bundle.id);
            return false;
        }

        const capacity = BigNumber.from(bundle.capacity);
        // ignore bundles with no capacity
        if (capacity.lte(0)) {
            console.log("bundle no capacity", bundle.id);
            return false;
        }
        // ignore bundles with less capacity then min protected amount (inconsistent)
        if (BigNumber.from(bundle.minSumInsured).gt(capacity)) {
            console.log("bundle minSumInsured greater than capacity", bundle.id);
            return false;
        }
        const capitalSupport = bundle.capitalSupport;
        if (capitalSupport !== undefined) {
            // if supported capital is defined, then only bundles with locked capital less than the capital support are used
            const capitalSupportBN = BigNumber.from(capitalSupport);
            const lockedBN = BigNumber.from(bundle.locked);
            // stake adjusted capacity
            const remainingCapacity = minBigNumber(capacity, capitalSupportBN.sub(lockedBN));
            console.log("bundleid", bundle.id, "remainingCapacity", remainingCapacity.toString(), "locked", bundle.locked, "capitalSupport", capitalSupport);
            if (remainingCapacity.lte(BigNumber.from(0))) {
                console.log("remaining capacity less than 0", bundle.id);
                return false;
            }
            if (remainingCapacity.lt(BigNumber.from(bundle.minSumInsured))) {
                console.log("remaining capacity less than min sum insured", bundle.id);
                return false;
            }
        }
        console.log("bundle is active", bundle.id);
        return true;
    }));
}
