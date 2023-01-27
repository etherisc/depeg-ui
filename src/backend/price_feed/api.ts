import { BigNumber } from "ethers";

export interface PriceFeedApi {

    getLatestPrice(priceRetrieved: (price: PriceInfo, triggeredAt: number, depeggedAt: number) => void): Promise<void>;
    getPrice(roundId: BigNumber, priceRetrieved: (price: PriceInfo) => void): Promise<void>;
    getAllPricesAfter(
        after: number, 
        priceRetrieved: (price: PriceInfo) => void,
        loadingStarted: () => void,
        loadingFinished: () => void,
    ): Promise<void>;

}