import { BigNumber } from "ethers";

export interface PriceFeedApi {

    getLatestPrice(priceRetrieved: (price: PriceInfo) => void): Promise<void>;
    getPrice(roundId: BigNumber, priceRetrieved: (price: PriceInfo) => void): Promise<void>;

}