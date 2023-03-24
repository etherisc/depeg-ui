import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { redisClient } from "../../../utils/redis";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("clearing bundles from redis");
    const bundlesjson = await redisClient.del("bundles");
    res.status(200).json({});
}
