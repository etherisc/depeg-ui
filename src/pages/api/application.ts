import { NextApiRequest, NextApiResponse } from "next";
import { redisClient } from "../../utils/redis";
import { PendingApplication, getPendingApplicationRepository } from "../../utils/pending_application";
import { EntityId } from "redis-om";
import { ulid } from "ulid";

export const STREAM_KEY = process.env.REDIS_QUEUE_STREAM_KEY ?? "application:signatures";

/**
 * GET request will return all pending application transactions. 
 * POST request will add a new application to the queue.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (process.env.NEXT_PUBLIC_FEATURE_GASLESS_TRANSACTION !== 'true') {
        res.status(404).send('Unsupported feature');
    } else if (req.method === 'GET') {
        await handleGet(req, res);
    } else if (req.method === 'POST') {
        await handlePost(req, res);
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Array<PendingApplication>>) {
    console.log("GET request to /api/application");
    // don't cache this request
    res.setHeader('Cache-Control', 'no-store');
    const address = req.query.address as string;
    if (!address) {
        res.status(400).send([]);
        return; 
    }
    const pendingTxRepo = await getPendingApplicationRepository();
    const pendingPolicyHolderTransactions = await pendingTxRepo.search().where("policyHolder").equals(address).return.all();
    console.log("pendingPolicyHolderTransactions", pendingPolicyHolderTransactions.length);
    res.status(200).json(pendingPolicyHolderTransactions.map(tx => tx as any as PendingApplication));
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

    // store pending application in redis
    const repo = await getPendingApplicationRepository();
    const entityId = ulid();
    await repo.save(entityId, {
        policyHolder: policyHolder,
        protectedWallet: protectedWallet,
        protectedBalance: protectedBalance.toString(),
        duration: duration,
        bundleId: bundleId,
        signatureId: signatureId,
        signature: signature,
        transactionHash: null,
        timestamp: new Date(),
    });
    console.log("created pending application", signatureId, entityId);

    // push message to stream (queue)
    const redisId = await redisClient.xAdd(STREAM_KEY, "*", 
    { 
        "entityId": entityId,
    });
    console.log("added application to queue", redisId, entityId, signatureId);
    
    res.status(200).send(redisId);
}
