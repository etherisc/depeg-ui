import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { redisClient } from "../../utils/redis";
import { nanoid } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";

const STREAM_KEY = "application:signatures";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    if (req.method === 'POST') {
        await handlePost(req, res);
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    console.log("POST request to /api/application");
    const bodyData = req.body;

    const policyHolder = bodyData.policyHolder as string;
    const protectedWallet = bodyData.protectedWallet as string;
    const protectedBalance = bodyData.protectedBalance as string;
    const duration = bodyData.duration as number;
    const bundleId = bodyData.bundleId as number;
    const signatureId = bodyData.signatureId as string;
    const signature = bodyData.signature as string;

    if (!policyHolder || !protectedWallet || !protectedBalance || !duration || !bundleId || !signatureId || !signature) {
        res.status(400).send("Missing required fields");
        return;
    }

    // const application = {
    //     policyHolder,
    //     protectedWallet,
    //     protectedBalance,
    //     duration,
    //     bundleId,
    //     signatureId,
    //     signature,
    // };
    // console.log("adding application to queue", application);

    const redisId = await redisClient.xAdd(STREAM_KEY, "*", 
        { 
            "policyHolder": policyHolder,
            "protectedWallet": protectedWallet,
            "protectedBalance": protectedBalance,
            "duration": duration.toString(),
            "bundleId": bundleId.toString(),
            "signatureId": signatureId,
            "signature": signature 
        });
    console.log("added application to queue", redisId);
    
    res.status(200).send(redisId);
}
