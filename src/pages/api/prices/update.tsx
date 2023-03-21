import { NextApiRequest, NextApiResponse } from "next";
import { AggregatorV3Interface } from "../../../contracts/chainlink-contracts";
import { AggregatorV3Interface__factory, DepegProduct__factory, UsdcPriceDataProvider__factory } from "../../../contracts/depeg-contracts";
import { getBackendVoidSigner } from "../../../utils/chain";


const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "0x0";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<number>
) {
    console.log("called /api/prices/update");
    const aggregator = await getAggregator();
    const prices = await fetchPrices(aggregator);    

    res.status(200).json(prices.length);
}

async function fetchPrices(aggregator: AggregatorV3Interface): Promise<Array<PriceData>> {
    const prices: PriceData[] = [];
    let { roundId, updatedAt, answer} = await aggregator.latestRoundData();
    prices.push({ roundId: roundId.toNumber(), price: answer.toNumber(), timestamp: updatedAt.toNumber() } as PriceData);
    console.log("roundData", roundId.toNumber(), updatedAt.toNumber(), answer.toNumber());

    let currentRound = roundId.toNumber();
    while(true) {
        const { roundId, updatedAt, answer} = await aggregator.getRoundData(--currentRound);
        if (roundId.toNumber() === 0) {
            break;
        }
        prices.push({ roundId: roundId.toNumber(), price: answer.toNumber(), timestamp: updatedAt.toNumber() } as PriceData);
        console.log("roundData", roundId.toNumber(), updatedAt.toNumber(), answer.toNumber());
        currentRound = roundId.toNumber();
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