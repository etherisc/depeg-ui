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
                <Trans i18nKey="payout_example.text1" t={t} values={{ currency, currency2, currencyUSD, depegThreshold, recoveryThreshold }}>
                    <Link target="_blank" href="/price" className="no_decoration">{t('payout_example.see_price_page')}</Link>
                </Trans> 
            </Typography>
            <Typography variant="body2" component="div">
                <Trans i18nKey="payout_example.text2" t={t} values={{
                        insuredAmount: formatCurrency(insuredAmount, 0),
                        payoutAmount: formatCurrency(payoutAmount, 0),
                        currency,
                        currency2,
                        currencyUSD, 
                        exampleRate, 
                        depegThreshold,
                    }}
                >
                    <b>bold</b>
                    <WithTooltip dottedUnderline tooltipText={t('payout_example.calculation_tooltip', {
                        insuredAmount: formatCurrency(insuredAmount, 0),
                        payoutAmount: formatCurrency(payoutAmount, 0),
                        currency,
                        currency2,
                        currencyUSD, 
                        exampleRate, 
                        depegThreshold,
                    })}>calculation formula</WithTooltip>
                </Trans>
            </Typography>
        </Box>
    </>);
}