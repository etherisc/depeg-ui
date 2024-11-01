import { NextApiRequest, NextApiResponse } from "next";
import { Repository } from "redis-om";
import { getPriceRepository } from "./fetch";
import { isIpAllowedToConnect } from "../../../utils/check_ip";
import { EntityId } from 'redis-om';

/**
 * Clear the redis price cache. 
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("called /api/prices/clear");

    if (! isIpAllowedToConnect(req, res)) {
        return;
    }

    const priceRepository = await getPriceRepository();
    await clearAllPrices(priceRepository);
    res.status(200).json({});
}

export async function clearAllPrices(priceRepository: Repository) {
    const allPrices = await priceRepository.search().return.all();
    allPrices.forEach(async (price) => {
        // @ts-expect-error EntityId is a symbol
        const id = price[EntityId];
        if (id !== undefined) {
            await priceRepository.remove(id);
        }
    });
}
