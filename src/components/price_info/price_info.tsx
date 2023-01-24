import { Typography } from "@mui/material";
import { timeStamp } from "console";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { addPrice } from "../../redux/slices/price";
import { RootState } from "../../redux/store";
import LatestPrice from "./latest_price";

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


    useEffect(() => {
        if (isConnected) {
            // get latest price
            priceFeedApi.getLatestPrice((price: PriceInfo) => dispatch(addPrice(price)));    
            // get price update every minute
            setInterval(() => {
                priceFeedApi.getLatestPrice((price: PriceInfo) => dispatch(addPrice(price)));    
            }, ONE_MINUTE);    
        }
    }, [isConnected, dispatch, priceFeedApi]);

    return (<>
        <LatestPrice 
            name={coinName}  
            symbol={coinSymbol}
            decimals={coinDecimals}
            price={latestPrice}
            timestamp={latestPriceTimestamp}
            />
    </>);
}