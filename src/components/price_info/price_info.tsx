import { Box } from "@mui/material";
import moment, { unitOfTime } from "moment";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { addPrice, clearHistory, historyLoading, historyLoadingFinished, setDepeggedAt, setTriggeredAt } from "../../redux/slices/price";
import { RootState } from "../../redux/store";
import LatestPrice from "./latest_price";
import PriceHistory from "./price_history";

const PRICE_UPDATE_INTERVAL = 60 * 1000;

interface PriceInfoProps {
    backend: BackendApi;
}

export default function PriceInfo(props: PriceInfoProps) {
    const { t } = useTranslation(['price', 'common']);
    const priceFeedApi = props.backend.priceFeed;
    const dispatch = useDispatch();

    const isConnected = useSelector((state: RootState) => state.chain.isConnected);

    const coinName = useSelector((state: RootState) => state.price.name);
    const coinSymbol = useSelector((state: RootState) => state.price.symbol);
    const coinDecimals = useSelector((state: RootState) => state.price.decimals);
    const latestPrice = useSelector((state: RootState) => state.price.latest.price);
    const latestPriceTimestamp = useSelector((state: RootState) => state.price.latest.timestamp);
    const triggeredAt = useSelector((state: RootState) => state.price.triggeredAt);
    const depeggedAt = useSelector((state: RootState) => state.price.depeggedAt);

    const priceHistory = useSelector((state: RootState) => state.price.history);
    const priceHistoryLoading = useSelector((state: RootState) => state.price.historyLoading);
    const historyDisplayRange = useSelector((state: RootState) => state.price.historyDisplayRange);

    const enablePriceHistory = process.env.NEXT_PUBLIC_FEATURE_PRICE_HISTORY === 'true' || false;

    useEffect(() => {
        async function getPrices() {
            // get latest price
            await priceFeedApi.getLatestPrice((price: PriceInfo) => {
                dispatch(addPrice(price));
            });

            // update price and state every minute
            setInterval(async () => {
                // get latest price
                await priceFeedApi.getLatestPrice((price: PriceInfo) => {
                    dispatch(addPrice(price));
                });
            }, PRICE_UPDATE_INTERVAL);

            // and if blockchain is connected get the onchain data
            if (isConnected) {
                // get produce state
                await priceFeedApi.getLatestProductState((triggeredAt: number, depeggedAt: number) => {
                    dispatch(setTriggeredAt(triggeredAt));
                    dispatch(setDepeggedAt(depeggedAt));
                });

                // and update it every minute
                setInterval(async () => {
                    // and state
                    await priceFeedApi.getLatestProductState((triggeredAt: number, depeggedAt: number) => {
                        dispatch(setTriggeredAt(triggeredAt));
                        dispatch(setDepeggedAt(depeggedAt));
                    });
                }, PRICE_UPDATE_INTERVAL);
            }

            // featch price history if enabled
            if ( enablePriceHistory ) {
                dispatch(clearHistory());
                const amount = parseInt(historyDisplayRange.at(0) ?? '1');
                const unit = historyDisplayRange.at(1) ?? 'w';
                const after = moment().add(-amount, unit as unitOfTime.Base).unix();
                await priceFeedApi.getAllPricesAfter(after, 
                    (price: PriceInfo) => dispatch(addPrice(price)),
                    () => dispatch(historyLoading()),
                    () => dispatch(historyLoadingFinished())
                );
            }
        }
        getPrices();
    }, [isConnected, dispatch, priceFeedApi, enablePriceHistory, historyDisplayRange]);

    return (<>
        <LatestPrice 
            name={coinName}  
            symbol={coinSymbol}
            decimals={coinDecimals}
            price={latestPrice}
            timestamp={latestPriceTimestamp}
            triggeredAt={triggeredAt}
            depeggedAt={depeggedAt}
            />
        { process.env.NEXT_PUBLIC_FEATURE_PRICE_HISTORY === 'true' && <Box sx={{ mt: 4, height: 600, width: 800 }}>
            <PriceHistory 
                name={coinName}  
                symbol={coinSymbol}
                decimals={coinDecimals}
                prices={priceHistory}
                triggeredAt={triggeredAt}
                depeggedAt={depeggedAt}
                isLoading={priceHistoryLoading}
                />
        </Box>}
    </>);
}