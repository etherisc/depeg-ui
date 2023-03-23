import { NextApiRequest, NextApiResponse } from "next";
import { AggregatorV3Interface } from "../../../contracts/chainlink-contracts";
import { AggregatorV3Interface__factory, DepegProduct__factory, UsdcPriceDataProvider__factory } from "../../../contracts/depeg-contracts";
import { getBackendVoidSigner } from "../../../utils/chain";
import { redisOmClient } from "../../../utils/redis";
import { PRICE_SCHEMA } from "./redis_price_objects";

const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "0x0";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<number>
) {
    console.log("called /api/prices/update");
    const aggregator = await getAggregator();
    const priceRepository = await getPriceRepository();

    const latestPrice = await priceRepository.search().sortBy('roundId', 'DESC').return.first();
    console.log("latestPrice", latestPrice);

    const prices = await fetchPrices(aggregator, parseInt(latestPrice?.roundId || '0'));    

    for (const price of prices) {
        priceRepository.createAndSave({ roundId: price.roundId, price: price.price, timestamp: new Date(price.timestamp * 1000)});
    }

    console.log("prices saved to redis");
    res.status(200).json(prices.length);
    console.log("prices update finished");
}

async function fetchPrices(aggregator: AggregatorV3Interface, latestPrice: number): Promise<Array<PriceData>> {
    const prices: PriceData[] = [];
    let { roundId, updatedAt, answer} = await aggregator.latestRoundData();
    console.log("roundData", roundId.toNumber(), updatedAt.toNumber(), answer.toNumber());

    let nextRound = roundId.toNumber();
    while(true) {
        const { roundId, updatedAt, answer} = await aggregator.getRoundData(nextRound);
        if (roundId.toNumber() <= 0 || roundId.toNumber() <= latestPrice) {
            break;
        }
        prices.push({ roundId: roundId.toNumber(), price: answer.toNumber(), timestamp: updatedAt.toNumber() } as PriceData);
        console.log("roundData", roundId.toNumber(), updatedAt.toNumber(), answer.toNumber());
        nextRound = roundId.toNumber() - 1;
    }

    console.log("price fetch finished. fetched", prices.length, "prices");
    return prices;
}

async function getAggregator(): Promise<AggregatorV3Interface> {
    const signer = await getBackendVoidSigner();
    let address = process.env.NEXT_PUBLIC_CHAINLINK_PRICEFEED_CONTRACT_ADDRESS;

    if (address === undefined) {
        const depegProduct = DepegProduct__factory.connect(depegProductContractAddress, signer);
        const priceDataProviderAddress = await depegProduct.getPriceDataProvider();
        const priceDataProvider = UsdcPriceDataProvider__factory.connect(priceDataProviderAddress, signer);
        address = await priceDataProvider.getChainlinkAggregatorAddress();
    }

    return AggregatorV3Interface__factory.connect(address, signer);
}

async function getPriceRepository() {
    const priceRepository = (await redisOmClient).fetchRepository(PRICE_SCHEMA);
    priceRepository.createIndex();
    return priceRepository;
}