import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PayoutExampleProps {
    disabled: boolean;
    insuredAmount: string | undefined;
}

export default function PayoutExample(props: PayoutExampleProps) {
    // TODO: disable if props.disabled
    const currency = 'USDC'; // TODO
    const currency2 = 'USDT'; // TODO
    const currencyUSD = 'USD'; // TODO
    const threshold = '0.995'; // TODO
    const exampleRate = '0.73'; // TODO

    let insuredAmount = 1000;

    if (props.insuredAmount !== undefined) {
        insuredAmount = parseFloat(props.insuredAmount);
    }

    const payoutAmount = insuredAmount - insuredAmount * parseFloat(exampleRate);

    return (<>
        <Typography variant="subtitle2" gutterBottom component="div">
            How does the protection work and how much will I get? 
        </Typography>
        <Box>
            <Typography variant="body2" gutterBottom component="div">
                If the price of {currency} drops below {currencyUSD} {threshold} for more than 24 hours, you will receive a payout in {currency2}.
                The payout is based on the price of {currency} after 24 hours and will cover your loss at that time. 
            </Typography>
            <Typography variant="body2" component="div">
                {/* TODO: 1000 sep */}
                <b>Example</b>: 
                If you <b>protect {currency} {insuredAmount.toFixed(2)}</b> from your wallet and the price of {currency} drops and is at {currencyUSD} {exampleRate} 
                &nbsp;24 hours after dropping below {currencyUSD} {threshold} you will receive a <b>payout</b> of <b>{currency2} {payoutAmount.toFixed(2)}</b>. {/* TODO: hover ((1 - {exampleRate}) * {insuredAmount}) */}
            </Typography>
        </Box>
    </>);
}