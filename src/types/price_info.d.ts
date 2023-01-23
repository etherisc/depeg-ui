type PriceInfo = {
    price: string,
    timestamp: Timestamp,
    state: PriceFeedState,
    triggeredAt: TimestampOptional,
    recoveredAt: TimestampOptional,
    depeggedAt: TimestampOptional,
}
