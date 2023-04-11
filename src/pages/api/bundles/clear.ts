import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { redisClient } from "../../../utils/redis";
import { isIpAllowedToConnect } from "../../../utils/check_ip";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("clearing bundles from redis");

    if (! isIpAllowedToConnect(req, res)) {
        return;
    }

    await redisClient.del("bundles");
    res.status(200).json({});
}
