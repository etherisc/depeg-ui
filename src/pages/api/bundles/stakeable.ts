import { NextApiRequest, NextApiResponse } from "next"
import { BundleData } from "../../../backend/bundle_data"
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, ethers, Signer } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../../../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "../../../backend/gif_registry";
import { IInstanceService } from "../../../contracts/gif-interface/IInstanceService";
import { DepegRiskpoolApi } from "../../../backend/riskpool_api";
import { redisClient } from "../../../utils/redis";
import { getLastBlockTimestamp, getVoidSigner } from "../../../utils/chain";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("getting all bundles from redis");
    const bundlesjson = await redisClient.get("bundles");
    
    if (bundlesjson == null) {
        res.status(500).json([]);
        return;
    }        

    const bundles = JSON.parse(bundlesjson) as Array<BundleData>;
    const lastBlockTimestamp = await getLastBlockTimestamp(await getVoidSigner());

    res.status(200).json(bundles.filter(bundle => {
        // ignore expired bundles
        if (lastBlockTimestamp > (bundle.createdAt + parseInt(bundle.lifetime))) {
            return false;
        }

        const capacity = BigNumber.from(bundle.capacity);
        // ignore bundles with no capacity
        if (capacity.lte(0)) {
            return false;
        }
        // ignore bundles with less capacity then min protected amount (inconsistent)
        if (BigNumber.from(bundle.minSumInsured).gt(capacity)) {
            return false;
        }
        const capitalSupport = bundle.capitalSupport;
        if (capitalSupport !== undefined) {
            // console.log("bundleid", bundle.id, "locked", bundle.locked, "capitalSupport", capitalSupport.toString());
            // if supported capital is defined, then only bundles with locked capital less than the capital support are used
            if (BigNumber.from(bundle.locked).gte(BigNumber.from(capitalSupport))) {
                return false;
            }
            console.log("stakes available", bundle.id);
        }
        return true;
    }));
}
