import { NextApiRequest, NextApiResponse } from "next";
import { Repository } from "redis-om";
import { getPriceRepository } from "./fetch";
import { Price } from "./redis_price_objects";
import { isIpAllowedToConnect } from "../../../utils/check_ip";

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

export async function clearAllPrices(priceRepository: Repository<Price>) {
    const allPrices = await priceRepository.search().return.all();
    allPrices.forEach(price => priceRepository.remove(price.entityId));
}
