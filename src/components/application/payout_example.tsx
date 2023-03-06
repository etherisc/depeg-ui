import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Trans, useTranslation } from "next-i18next";
import { formatCurrency } from "../../utils/numbers";
import { ProxyType } from "immer/dist/internal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import WithTooltip from "../with_tooltip";

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

    let insuredAmt = 1000;

    if (props.insuredAmount !== undefined) {
        insuredAmt = parseFloat(props.insuredAmount);
    }
    const insuredAmount = formatCurrency(insuredAmt, 0);

    const payoutAmt = insuredAmt - insuredAmt * parseFloat(exampleRate);
    const payoutAmount = formatCurrency(payoutAmt, 0);

    return (<>
        <Typography variant="subtitle2" gutterBottom component="div">
            {t('payout_example.title')}
        </Typography>
        <Box>
            <Typography variant="body2" gutterBottom component="div" data-testid="text1">
                <Trans i18nKey="payout_example.text1" t={t} 
                    values={{ currency, currency2, currencyUSD, depegThreshold, recoveryThreshold }}
                    >
                    <Link target="_blank" href="/price" className="no_decoration">{t('payout_example.see_price_page')}</Link>
                    {/* print values for testing */}
                    {depegThreshold}
                    {recoveryThreshold}
                </Trans> 
            </Typography>
            <Typography variant="body2" component="div" data-testid="text2">
                <Trans i18nKey="payout_example.text2" t={t} values={{
                        insuredAmount,
                        payoutAmount,
                        currency,
                        currency2,
                        currencyUSD, 
                        exampleRate, 
                        depegThreshold,
                    }}
                >
                    <b>bold</b>
                    <WithTooltip dottedUnderline tooltipText={t('payout_example.calculation_tooltip', {
                        insuredAmount,
                        currency2,
                        exampleRate, 
                    })}>calculation formula</WithTooltip>
                    {/* print values for testing */}
                    {exampleRate}
                    {insuredAmount}
                    {payoutAmount}
                </Trans>
            </Typography>
        </Box>
    </>);
}