import { NextApiRequest, NextApiResponse } from "next";
import { getPriceRepository } from "./fetch";
import { Price } from "./redis_price_objects";

/**
 * Returns all prices from redis.
 * 
 * Possible query parameters:
 * - after: Only return prices after the given timestamp im milliseconds.
 * - page: The page to return. Default: 0
 * - count: The number of prices to return per page. Default: 0 (all)
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<PriceData>>
) {
    console.log("called /api/prices/all");
    const priceRepository = await getPriceRepository();

    let prices;
    let query = priceRepository.search();
    
    if (req.query.after !== undefined) {
        query = query.where("timestamp").after(new Date(parseInt(req.query.after as string)));
    }

    if (req.query.page !== undefined || req.query.count !== undefined) {
        const count = parseInt(req.query.count as string ?? "0");
        const offset = parseInt(req.query.page as string ?? "0") * count;
        prices = await query.sortBy('roundId', 'DESC').return.page(offset, count);
    } else {
        prices = await query.sortBy('roundId', 'DESC').return.all();
    }

    res.status(200).json(prices.map(priceEnt => { 
        const price = priceEnt as any as Price;
        return {
                roundId: price.roundId, 
                price: price.price, 
                timestamp: price.timestamp.getTime(),
            } as PriceData;
    }));
    
}