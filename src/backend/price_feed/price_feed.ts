import { BigNumber, Signer } from "ethers";
import { AggregatorV3Interface, AggregatorV3Interface__factory } from "../../contracts/chainlink-contracts";
import { DepegProduct__factory, UsdcPriceDataProvider__factory } from "../../contracts/depeg-contracts";
import { PriceFeedApi } from "./api";

export class PriceFeed implements PriceFeedApi {

    private productAddress: string;
    private signer: Signer;
    private chainlinkAggregatorAddress: string | undefined;
    private aggregator: AggregatorV3Interface | undefined;

    constructor(productAddress: string, signer: Signer) {
        this.productAddress = productAddress;
        this.signer = signer;
        this.chainlinkAggregatorAddress = process.env.NEXT_PUBLIC_CHAINLINK_PRICEFEED_CONTRACT_ADDRESS;
    }

    async getChainlinkAggregator(): Promise<AggregatorV3Interface> {
        if (this.aggregator !== undefined) {
            return this.aggregator;
        }

        let address = this.chainlinkAggregatorAddress;
        if (address === undefined) {
            const depegProduct = DepegProduct__factory.connect(this.productAddress, this.signer);
            const priceDataProviderAddress = await depegProduct.getPriceDataProvider();
            const priceDataProvider = UsdcPriceDataProvider__factory.connect(priceDataProviderAddress, this.signer);
            address = await priceDataProvider.getChainlinkAggregatorAddress();
        }

        this.aggregator = AggregatorV3Interface__factory.connect(address, this.signer);
        return this.aggregator;
    }

    async getLatestPrice(priceRetrieved: (price: PriceInfo) => void): Promise<void> {
        const aggregator = await this.getChainlinkAggregator();
        const latestRoundData = await aggregator.latestRoundData();
        const priceInfo: PriceInfo = {
            roundId: latestRoundData.roundId.toString(),
            price: latestRoundData.answer.toString(),
            timestamp: latestRoundData.updatedAt.toNumber(),
        };
        priceRetrieved(priceInfo);
    }
    
    async getPrice(roundId: BigNumber, priceRetrieved: (price: PriceInfo) => void): Promise<void> {
        const aggregator = await this.getChainlinkAggregator();
        const roundData = await aggregator.getRoundData(roundId);
        const priceInfo: PriceInfo = {
            roundId: roundData.roundId.toString(),
            price: roundData.answer.toString(),
            timestamp: roundData.updatedAt.toNumber(),
        };
        priceRetrieved(priceInfo);
    }
}