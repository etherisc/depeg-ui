import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { redisClient } from "../../../utils/redis";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("getting all bundles from redis");
    const bundlesjson = await redisClient.get("bundles");
    
    if (bundlesjson == null) {
        res.status(200).json([]);
        return;
    }        

    const bundles = JSON.parse(bundlesjson) as Array<BundleData>;
    res.status(200).json(bundles);
}

