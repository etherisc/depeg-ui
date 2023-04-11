import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

const allowedIPs = process.env.API_IP_ALLOWED?.split(",").map(x => x.trim()) ?? [];

/**
 * Checks if origin up is allowed to access the API and if not returns 401
 */
export function isIpAllowedToConnect(req: NextApiRequest, res: NextApiResponse): boolean {
    const clientIp = requestIp.getClientIp(req);
    if (allowedIPs.length > 0 && allowedIPs.includes(clientIp ?? "") === false) {
        console.log("unauthorized ip", clientIp);
        res.status(401).json([]);
        return false;
    }
    return true;
}
