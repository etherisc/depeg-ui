import { Box, Link, Typography } from "@mui/material";
import { Trans, useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatCurrency } from "../../utils/numbers";
import WithTooltip from "../with_tooltip";

interface PayoutExampleProps {
    protectedAmount: string | undefined;
    currency: string;
    currency2: string;
}

export default function PayoutExample(props: PayoutExampleProps) {
    const { t } = useTranslation('application');
    
    const currency = props.currency;
    const currency2 = props.currency2;
    const currencyUSD = 'USD';
    const triggerThreshold = process.env.NEXT_PUBLIC_DEPEG_TRIGGER_THRESHOLD || '0.995';
    const recoveryThreshold = process.env.NEXT_PUBLIC_DEPEG_RECOVERY_THRESHOLD || '0.999';
    const recoveryWindowHours = process.env.NEXT_PUBLIC_DEPEG_RECOVERY_WINDOW_HOURS || '24';
    const minimumPrice = process.env.NEXT_PUBLIC_DEPEG_MINIMUM_PRICE || '0.80';
    const maximumDepegPct = process.env.NEXT_PUBLIC_DEPEG_MAXIMUM_DEPEG_PCT || '20';
    const exampleRate = useSelector((state: RootState) => state.application.exampleRate);

    let protectedAmt = 1000;

    if (props.protectedAmount !== undefined) {
        protectedAmt = parseFloat(props.protectedAmount);
    }
    const protectedAmount = formatCurrency(protectedAmt, 0);

    const payoutAmt = protectedAmt - protectedAmt * parseFloat(exampleRate);
    const payoutAmount = formatCurrency(payoutAmt, 0);
    const maxProtectedAmount = formatCurrency(protectedAmt * (1 - parseFloat(minimumPrice)), 0);

    return (<>
        <Typography variant="subtitle2" gutterBottom component="div">
            {t('payout_example.title')}
        </Typography>
        <Box>
            <Typography variant="body2" gutterBottom component="div" data-testid="text1">
                <Trans i18nKey="payout_example.text1" t={t} 
                    values={{ currency, currency2, currencyUSD, triggerThreshold, recoveryThreshold, recoveryWindowHours, minimumPrice, maximumDepegPct }}
                    >
                    <Link target="_blank" href="/price" className="no_decoration">{t('payout_example.see_price_page')}</Link>
                    {/* print values for testing */}
                    {triggerThreshold}
                    {recoveryThreshold}
                    {recoveryWindowHours}
                    {minimumPrice}
                    {maximumDepegPct}
                </Trans> 
            </Typography>
            <Typography variant="body2" component="div" data-testid="text2">
                <Trans i18nKey="payout_example.text2" t={t} values={{
                        protectedAmount,
                        payoutAmount,
                        currency,
                        currency2,
                        currencyUSD, 
                        exampleRate, 
                        triggerThreshold,
                        maxProtectedAmount,
                    }}
                >
                    <b>bold</b>
                    <WithTooltip dottedUnderline tooltipText={t('payout_example.calculation_tooltip', {
                        protectedAmount,
                        currency2,
                        exampleRate, 
                    })}>calculation formula</WithTooltip>
                    {/* print values for testing */}
                    {exampleRate}
                    {protectedAmount}
                    {payoutAmount}
                    {maxProtectedAmount}
                </Trans>
            </Typography>
        </Box>
    </>);
}