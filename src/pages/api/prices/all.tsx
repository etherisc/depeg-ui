import { NextApiRequest, NextApiResponse } from "next";
import { getPriceRepository } from "./fetch";

/**
 * Returns all prices from redis.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<PriceData>>
) {
    console.log("called /api/prices/all");
    const priceRepository = await getPriceRepository();

    let query = await priceRepository.search().sortBy('roundId', 'DESC')
    let prices;

    if (req.query.page !== undefined || req.query.count !== undefined) {
        const count = parseInt(req.query.count as string ?? "0");
        const offset = parseInt(req.query.page as string ?? "0") * count;
        prices = await query.return.page(offset, count);
    } else {
        prices = await query.return.all();
    }

    res.status(200).json(prices.map(price => { 
        return {
                roundId: price.roundId, 
                price: price.price, 
                timestamp: price.timestamp.getTime()
            } as PriceData;
    }));
    
}