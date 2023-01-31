import { Box, Typography } from "@mui/material";
import { timeStamp } from "console";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { addPrice, historyLoading, historyLoadingFinished, setDepeggedAt, setTriggeredAt } from "../../redux/slices/price";
import { RootState } from "../../redux/store";
import LatestPrice from "./latest_price";
import PriceHistory from "./price_history";

const ONE_MINUTE = 60 * 1000;

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

    const disablePriceHistory = process.env.NEXT_PUBLIC_DISABLE_PRICE_HISTORY === 'true' || false;

    useEffect(() => {
        async function getPrices() {
            if (isConnected) {
                // get latest price
                await priceFeedApi.getLatestPrice((price: PriceInfo, triggeredAt: number, depeggedAt: number) => {
                    dispatch(addPrice(price))
                    dispatch(setTriggeredAt(triggeredAt));
                    dispatch(setDepeggedAt(depeggedAt));
                });    

                if ( ! disablePriceHistory) {
                    await priceFeedApi.getAllPricesAfter(moment().add(-2, "d").unix(), 
                        (price: PriceInfo) => dispatch(addPrice(price)),
                        () => dispatch(historyLoading()),
                        () => dispatch(historyLoadingFinished())
                    );
                }

                // get price update every minute
                setInterval(async () => {
                    await priceFeedApi.getLatestPrice((price: PriceInfo, triggeredAt: number, depeggedAt: number) => {
                        dispatch(addPrice(price));
                        dispatch(setTriggeredAt(triggeredAt));
                        dispatch(setDepeggedAt(depeggedAt));
                    })
                }, 60000);    
                
            }
        }
        getPrices();
    }, [isConnected, dispatch, priceFeedApi, disablePriceHistory]);

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