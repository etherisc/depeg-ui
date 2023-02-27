import { Grid } from "@mui/material";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatAddress } from "../../utils/address";
import { formatDateTimeUtc } from "../../utils/date";
import { formatCurrencyBN } from "../../utils/numbers";
import WithTooltip from "../with_tooltip";

interface BundleDetailsProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
}

export default function BundleDetails(props: BundleDetailsProps) {
    const { t } = useTranslation('bundles');

    const symbol = props.currency;
    const capacity = BigNumber.from(props.bundle.capacity);
    const balance = BigNumber.from(props.bundle.balance);
    const locked = BigNumber.from(props.bundle.locked);
    const capitalSupport = BigNumber.from(props.bundle.capitalSupport);
    const capitalSupportRemaining = BigNumber.from(props.bundle.capitalSupport).sub(locked);
    const minSumInsured = BigNumber.from(props.bundle.minSumInsured);
    const maxSumInsured = BigNumber.from(props.bundle.maxSumInsured);
    const minDuration = props.bundle.minDuration / 86400;
    const maxDuration = props.bundle.maxDuration / 86400;
    const state = props.bundle.state;
    const createdAtTS = props.bundle.createdAt;
    const endTS = props.bundle.createdAt + BigNumber.from(props.bundle.lifetime).toNumber();

    return (<>
        <Grid container spacing={1} data-testid="bundle-details">
            <NameValue name={t('state')} value={t('bundle_state_' + state, { ns: 'common'})}/>
            <NameValue name={t('balance')} value={symbol + " " + formatCurrencyBN(balance, props.decimals)} tooltip={t('balance_tooltip')} />
            <NameValue name={t('capacity')} value={symbol + " " + formatCurrencyBN(capacity, props.decimals)} tooltip={t('capacity_tooltip')} />
            <NameValue name={t('locked')} value={symbol + " " + formatCurrencyBN(locked, props.decimals)} tooltip={t('locked_tooltip')} />
            <NameValue name={t('supported_capital')} value={symbol + " " + formatCurrencyBN(capitalSupport, props.decimals)} tooltip={t('supported_capital_tooltip')} />
            <NameValue name={t('supported_capital_remaining')} value={symbol + " " + formatCurrencyBN(capitalSupportRemaining, props.decimals)} tooltip={t('supported_capital_remaining_tooltip')} />
            <NameValue name={t('min_max_sum_insured')} value={symbol + " " + formatCurrencyBN(minSumInsured, props.decimals) + " / " + formatCurrencyBN(maxSumInsured, props.decimals)}/>
            <NameValue name={t('min_max_duration')} value={minDuration + " / " + " " + maxDuration + " " + t('days')}/>
            <NameValue name={t('apr')} value={props.bundle.apr + " %"}/>
            <NameValue name={t('policies')} value={props.bundle.policies.toString()}/>
            <NameValue name={t('owner')} value={formatAddress(props.bundle.owner)}/>
            <NameValue name={t('creation_date')} value={formatDateTimeUtc(createdAtTS)}/>
            <NameValue name={t('open_until')} value={formatDateTimeUtc(endTS)}/>
        </Grid>
    </>);
}

function NameValue(props: { name: string, value: string, tooltip?: string }) {
    let value = (<>{props.value}</>);
    if (props.tooltip) {
        value = (<WithTooltip tooltipText={props.tooltip} typographyVariant="body1">
            {value}
        </WithTooltip>);
    }
    return (<>
        <Grid item xs={12} md={5}>
            {props.name}
        </Grid>
        <Grid item xs={12} md={7}>
            {value}
        </Grid>
    </>);
}
