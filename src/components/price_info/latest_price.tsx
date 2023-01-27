import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber, FixedNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import moment from "moment";

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
    
    function formatWithDecimals(value: BigNumber, decimals: number) {
        // console.log(value.toNumber());
        const v = formatUnits(value, props.decimals);
        // console.log(v);
        return (+v).toFixed(decimals);
    }

    function stability() {
        if (props.depeggedAt > 0) {
            return "Depegged";
        }
        if (props.triggeredAt > 0) {
            return "Triggered";
        }
        return "Stable";
    }

    const priceStr = formatWithDecimals(BigNumber.from(props.price), 4);
    const timestampStr = moment.utc(props.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss UTC");

    return (<>
        <Box sx={{ display: 'flex', mb: 2 }} data-testid="currency-info">
            <Typography variant="h5" sx={{ placeSelf: 'baseline' }}>{props.name}</Typography>
            <Typography variant="subtitle1" color={grey[700]} sx={{ ml: 2, placeSelf: 'baseline' }}>{props.symbol}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }} data-testid="exchange-rate">
            <Typography variant="h6"  sx={{ placeSelf: 'baseline' }}>
                <FontAwesomeIcon icon={faDollarSign} className="fa" />&nbsp;{priceStr}
            </Typography>
            <Typography variant="body2" color={grey[700]} sx={{ ml: 2, placeSelf: 'baseline' }}>
                ({timestampStr})
            </Typography>
        </Box>
        <Box sx={{ display: 'flex' }} data-testid="stability">
            <Typography variant="h6"  sx={{ placeSelf: 'baseline' }}>
                Stability: {stability()}
            </Typography>
        </Box>
    </>);
}