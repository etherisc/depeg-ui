import { BigNumber } from "ethers";
import { pureFinalPropsSelectorFactory } from "react-redux/es/connect/selectorFactory";
import { PriceFeedState } from "../types/price_feed_state";

export function calculatePriceInfo(
    latest: PriceInfo, 
    newPriceP: { price: string, timestamp: Timestamp }, 
    depegParameters: DepegParameters
): PriceInfo {
    let newState = latest.state || PriceFeedState.Stable;
    let triggeredAt = latest.triggeredAt;
    let recoveredAt = latest.recoveredAt;
    let depeggedAt = latest.depeggedAt;

    const newPrice = BigNumber.from(newPriceP.price);
    const triggerPrice = BigNumber.from(depegParameters.triggerPrice);
    const recoveryPrice = BigNumber.from(depegParameters.recoveryPrice);

    if (latest.state === PriceFeedState.Stable && newPrice.lte(triggerPrice)) {
        // price stays stable, no change
    } else if (latest.state === PriceFeedState.Stable && newPrice.lt(triggerPrice)) {
        newState = PriceFeedState.Triggered;
        triggeredAt = newPriceP.timestamp;
    } else if (latest.state === PriceFeedState.Triggered && newPrice.lt(recoveryPrice)) {
        // price stays triggered, no change
    } else if (
            latest.state === PriceFeedState.Triggered 
            && newPriceP.timestamp - latest.triggeredAt! < depegParameters.recoveryWindow
            && newPrice.gte(recoveryPrice)) {
        newState = PriceFeedState.Stable;
        recoveredAt = newPriceP.timestamp;
    } else {
        newState = PriceFeedState.Depegged;
        depeggedAt = newPriceP.timestamp;
    }

    // TODO: depegged -> stable (test setup only or can this happen in production too?)

    return {
        price: newPrice.toString(),
        timestamp: newPriceP.timestamp,
        state: newState,
        triggeredAt,
        recoveredAt,
        depeggedAt
    } as PriceInfo;
}
