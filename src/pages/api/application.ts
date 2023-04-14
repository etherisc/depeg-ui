import { NextApiRequest, NextApiResponse } from "next";
import { PendingTransaction, getPendingTransactionRepository } from "../../utils/pending_trx";
import { redisClient } from "../../utils/redis";

const STREAM_KEY = "application:signatures";

/**
 * GET request will return all pending application transactions. 
 * POST request will add a new application to the queue.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        await handleGet(req, res);
    } else if (req.method === 'POST') {
        await handlePost(req, res);
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Array<PendingTransaction>>) {
    console.log("POST request to /api/application");
    const pendingTxRepo = await getPendingTransactionRepository();
    const pendingTransactions = await pendingTxRepo.search().return.all();
    res.status(200).json(pendingTransactions);
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
