import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PayoutExampleProps {
    disabled: boolean;
}

export default function PayoutExample(props: PayoutExampleProps) {
    // TODO: disable if props.disabled
    const currency = 'USDC'; // TODO
    const currency2 = 'USDT'; // TODO
    const currencyUSD = 'USD'; // TODO
    const threshold = '0.995'; // TODO
    const exampleRate = '0.73'; // TODO

    return (<>
        <Typography variant="subtitle2" gutterBottom component="div">
            How does the protection work and how much will i get?
        </Typography>
        <Box>
            <Typography variant="body2" gutterBottom component="div">
                If the price of {currency} drops below {currencyUSD} {threshold} for more than 24 hours, you will receive a payout in {currency2}.
                The payout is based on the price of {currency} after 24 hours and will cover your loss at this time. 
            </Typography>
            <Typography variant="body2" component="div">
                Example: If you protect {currency} 1000 from your wallet and the price of {currency} drops and is at {currencyUSD} {exampleRate} 24 hours after dropping below {currencyUSD} {threshold} you will receive a payout of {currency2} 270.
            </Typography>
        </Box>
    </>);
}