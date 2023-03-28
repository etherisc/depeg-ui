import { NextApiRequest, NextApiResponse } from "next";
import { getPriceRepository } from "./fetch";

/**
 * Returns the latest price from redis.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PriceData>
) {
    console.log("called /api/prices/all");
    const priceRepository = await getPriceRepository();
    const price = await priceRepository.search().sortBy('roundId', 'DESC').return.first();
    
    if (price === null) {
        res.status(200).json({} as PriceData);
        return;
    }
    
    res.status(200).json({
        roundId: price.roundId, 
        price: price.price, 
        timestamp: price.timestamp.getTime()
    } as PriceData);
    
}