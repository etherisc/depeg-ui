import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber, FixedNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import moment from "moment";
import RateAndStability from "./rate_and_stability";

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

    const timestampStr = moment.utc(props.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss UTC");

    return (<>
        <Box sx={{ display: 'flex', mb: 2 }} data-testid="currency-info">
            <Typography variant="h5" sx={{ placeSelf: 'baseline' }}>{props.name}</Typography>
            <Typography variant="subtitle1" color={grey[700]} sx={{ ml: 2, placeSelf: 'baseline' }}>{props.symbol}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }} data-testid="exchange-rate">
            <RateAndStability 
                price={props.price}
                decimals={props.decimals}
                triggeredAt={props.triggeredAt}
                depeggedAt={props.depeggedAt}
                />
        </Box>
        <Box>
            <Typography variant="body2" color={grey[700]} sx={{ placeSelf: 'baseline' }}>
                ({timestampStr})
            </Typography>
        </Box>
        <Box sx={{ display: 'flex' }} data-testid="stability">
            
        </Box>
    </>);
}