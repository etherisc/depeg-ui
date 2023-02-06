import { NextApiRequest, NextApiResponse } from "next"
import { BundleData } from "../../../backend/bundle_data"
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../../../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "../../../backend/gif_registry";
import { IInstanceService } from "../../../contracts/gif-interface/IInstanceService";
import { DepegRiskpoolApi } from "../../../backend/riskpool_api";
import { redisClient } from "../../../utils/redis";


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
    res.status(200).json(bundles);
}

