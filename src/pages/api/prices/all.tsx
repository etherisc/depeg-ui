import { NextApiRequest, NextApiResponse } from "next";
import { getPriceRepository } from "./update";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<PriceData>>
) {
    // TODO: add filters
    console.log("called /api/prices/all");
    const priceRepository = await getPriceRepository();
    const prices = await priceRepository.search().sortBy('roundId', 'DESC').return.all();
    res.status(200).json(prices.map(price => { 
        return {
                roundId: price.roundId, 
                price: price.price, 
                timestamp: price.timestamp.getTime()
            } as PriceData;
    }));
    
}