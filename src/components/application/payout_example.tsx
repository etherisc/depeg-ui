import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from "next-i18next";
import { formatCurrency } from "../../utils/numbers";
import { ProxyType } from "immer/dist/internal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface PayoutExampleProps {
    insuredAmount: string | undefined;
    currency: string;
    currency2: string;
}

export default function PayoutExample(props: PayoutExampleProps) {
    const { t } = useTranslation('application');
    
    const currency = props.currency;
    const currency2 = props.currency2;
    const currencyUSD = 'USD';
    const depegThreshold = '0.995';
    const recoveryThreshold = '0.999';
    const exampleRate = useSelector((state: RootState) => state.application.exampleRate);

    let insuredAmount = 1000;

    if (props.insuredAmount !== undefined) {
        insuredAmount = parseFloat(props.insuredAmount);
    }

    const payoutAmount = insuredAmount - insuredAmount * parseFloat(exampleRate);

    return (<>
        <Typography variant="subtitle2" gutterBottom component="div">
            {t('payout_example.title')}
        </Typography>
        <Box>
            <Typography variant="body2" gutterBottom component="div">
                {t('payout_example.text1', {currency, currency2, currencyUSD, depegThreshold, recoveryThreshold})}
                (<Link target="_blank" href="/price" className="no_decoration">{t('payout_example.see_price_page')}</Link>)
            </Typography>
            <Typography variant="body2" component="div">
                <b>{t('example')}</b>:&nbsp;
                {t('payout_example.text2', { 
                    currency, currency2, currencyUSD, 
                    insuredAmount: formatCurrency(insuredAmount, 0), 
                    exampleRate, 
                    payoutAmount: formatCurrency(payoutAmount, 0), 
                    depegThreshold 
                })}
                {/* TODO: hover ((1 - {exampleRate}) * {insuredAmount}) */}
            </Typography>
        </Box>
    </>);
}