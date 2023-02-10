import { BigNumber } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { getLastBlockTimestamp, getVoidSigner } from "../../../utils/chain";
import { redisClient } from "../../../utils/redis";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("getting stakeable bundles from redis");
    const bundlesjson = await redisClient.get("bundles");
    
    if (bundlesjson == null) {
        res.status(200).json([]);
        return;
    }        

    const bundles = JSON.parse(bundlesjson) as Array<BundleData>;
    const lastBlockTimestamp = await getLastBlockTimestamp(await getVoidSigner());

    res.status(200).json(bundles.filter(bundle => {
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
            console.log("bundleid", bundle.id, "locked", bundle.locked, "capitalSupport", capitalSupport.toString());
            // if supported capital is defined, then only bundles with locked capital less than the capital support are used
            if (BigNumber.from(bundle.locked).gte(BigNumber.from(capitalSupport))) {
                console.log("bundle locked capital greater than capital support", bundle.id);
                return false;
            }
        }
        console.log("bundle stakeable", bundle.id);
        return true;
    }));
}
