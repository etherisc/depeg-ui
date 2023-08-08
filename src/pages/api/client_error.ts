import { NextApiRequest, NextApiResponse } from "next";

/**
 * POST request will log an error that occured on the client side (supported fields are message, stack, action, client_timestamp)
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        await handlePost(req, res);
    } else {
        res.status(405).send('Only POST requests allowed');
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    console.log("POST request to /api/client_error");
    const bodyData = req.body;

    const message = bodyData.message as string;
    const stack = bodyData.stack as string;
    const action = bodyData.action as string;
    const client_timestamp = bodyData.client_timestamp as number || 0;
    
    console.log("error occured on client side during action '" + action 
        + "'\n======\n" 
        + message 
        + "\n------\n" 
        + stack 
        + "\n------\n" 
        + client_timestamp + " / " + new Date(client_timestamp).toLocaleString()
        + "\n======\n");
    
    res.status(200).json({});
}
