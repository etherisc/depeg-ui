import { BigNumber, Signer } from "ethers";
import { AggregatorV3Interface, AggregatorV3Interface__factory } from "../../contracts/chainlink-contracts";
import { DepegProduct__factory, UsdcPriceDataProvider, UsdcPriceDataProvider__factory } from "../../contracts/depeg-contracts";
import { PriceFeedApi } from "./api";

const MAX_DATAPOINTS = 100;

export class PriceFeed implements PriceFeedApi {

    private productAddress: string;
    private signer: Signer;
    private chainlinkAggregatorAddress: string | undefined;
    private aggregator: AggregatorV3Interface | undefined;
    private priceDataProvider: UsdcPriceDataProvider | undefined;

    constructor(productAddress: string, signer: Signer) {
        this.productAddress = productAddress;
        this.signer = signer;
        this.chainlinkAggregatorAddress = process.env.NEXT_PUBLIC_CHAINLINK_PRICEFEED_CONTRACT_ADDRESS;
    }

    async getChainlinkAggregator(): Promise<AggregatorV3Interface> {
        if (this.aggregator !== undefined) {
            return this.aggregator;
        }

        await this.init();
        return this.aggregator!;
    }

    async init() {
        let address = this.chainlinkAggregatorAddress;
        if (address === undefined) {
            const depegProduct = DepegProduct__factory.connect(this.productAddress, this.signer);
            const priceDataProviderAddress = await depegProduct.getPriceDataProvider();
            this.priceDataProvider = UsdcPriceDataProvider__factory.connect(priceDataProviderAddress, this.signer);
            address = await this.priceDataProvider.getChainlinkAggregatorAddress();
        }

        this.aggregator = AggregatorV3Interface__factory.connect(address, this.signer);
    }

    async getPriceDataProvider(): Promise<UsdcPriceDataProvider> {
        if (this.priceDataProvider !== undefined) {
            return this.priceDataProvider;
        }

        await this.init();
        return this.priceDataProvider!;
    }

    /**
     * Get the latest price from the price feed api
     */
    async getLatestPrice(priceRetrieved: (price: PriceInfo) => void): Promise<void> {
        const priceDataRes = await fetch('/api/prices/latest');

        if (priceDataRes.status !== 200) {
            throw new Error("Failed to fetch latest price");
        }

        const priceData = await priceDataRes.json() as PriceData;

        if (priceData.price === undefined) {
            return;
        }

        // console.log(priceInfo, triggeredAt.toNumber(), depeggedAt.toNumber());
        priceRetrieved({ 
            roundId: BigNumber.from(priceData.roundId).toString(),
            price: BigNumber.from(priceData.price).toString(),
            timestamp: priceData.timestamp / 1000,
        });
    }

    /**
     * Get the latest product state from the onchain price data provider
     */
    async getLatestProductState(stateRetrieved: (triggeredAt: number, depeggedAt: number) => void): Promise<void> {
        const aggregator = await this.getPriceDataProvider();
        const { triggeredAt, depeggedAt } = await aggregator.getLatestPriceInfo();
        // console.log(priceInfo, triggeredAt.toNumber(), depeggedAt.toNumber());
        stateRetrieved(triggeredAt.toNumber(), depeggedAt.toNumber());
    }

    async getPrice(roundId: BigNumber, priceRetrieved: (price: PriceInfo) => void): Promise<void> {
        const aggregator = await this.getPriceDataProvider();
        const roundData = await aggregator.getRoundData(roundId);
        const priceInfo: PriceInfo = {
            roundId: roundData.roundId.toString(),
            price: roundData.answer.toString(),
            timestamp: roundData.updatedAt.toNumber(),
        };
        priceRetrieved(priceInfo);
    }

    async getAllPricesAfter(
        after: number, 
        priceRetrieved: (price: PriceInfo) => void, 
        loadingStarted: () => void,
        loadingFinished: () => void,
    ): Promise<void> {
        console.log("fetching historical prices after " + after);
        loadingStarted();
        const pricesResult = await fetch('/api/prices/all?after=' + (after * 1000));

        if (pricesResult.status !== 200) {
            throw new Error("Failed to fetch historical prices");
        }

        const prices = await pricesResult.json() as PriceData[];
        prices.map(price => {
            const priceInfo: PriceInfo = {
                roundId: BigNumber.from(price.roundId).toString(),
                price: BigNumber.from(price.price).toString(),
                timestamp: price.timestamp / 1000,
            };
            priceRetrieved(priceInfo);
        });

        loadingFinished();
        console.log("finished getting historical prices");
    }

}