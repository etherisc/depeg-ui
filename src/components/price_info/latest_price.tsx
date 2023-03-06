import { Box, Link, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTranslation } from "next-i18next";
import PriceAndStability from "./price_and_stability";
import PriceTimestamp from "./price_timestamp";

interface LatestPriceProps {
    name:string;
    symbol: string;
    decimals: number;
    price: string;
    timestamp: number;
    triggeredAt: number;
    depeggedAt: number;
}

export default function LatestPrice(props: LatestPriceProps) {
    const { t } = useTranslation(['price', 'common']);
    const pricefeedUrl = process.env.NEXT_PUBLIC_PRICEFEED_URL || 'https://data.chain.link/ethereum/mainnet/stablecoins/usdc-usd';

    return (<>
        <Box sx={{ display: 'flex', mb: 2 }} data-testid="currency-info">
            <Typography variant="h5" sx={{ placeSelf: 'baseline' }}>{props.name}</Typography>
            <Typography variant="subtitle1" color={grey[700]} sx={{ ml: 2, placeSelf: 'baseline' }}>{props.symbol}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }} >
            <PriceAndStability 
                price={props.price}
                decimals={props.decimals}
                triggeredAt={props.triggeredAt}
                depeggedAt={props.depeggedAt}
                />
        </Box>
        <Box sx={{ display: 'flex', mb: 2 }}>
            <PriceTimestamp timestamp={props.timestamp} triggeredAt={props.triggeredAt} depeggedAt={props.depeggedAt} />
            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                <Link target="_blank" href={pricefeedUrl} rel="noreferrer" className="no_decoration">{t('reference_pricefeed')}</Link>
            </Typography>
        </Box>
    </>);
}