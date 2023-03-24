import { NextApiRequest, NextApiResponse } from "next";
import { getPriceRepository } from "./fetch";

/**
 * Clear the redis price cache. 
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("called /api/prices/clear");
    const priceRepository = await getPriceRepository();
    const allPrices = await priceRepository.search().return.all();
    allPrices.forEach(price => priceRepository.remove(price.entityId));
    res.status(200).json({});
}
