import { Grid } from "@mui/material";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrencyBN } from "../../utils/numbers";

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
    const minSumInsured = BigNumber.from(props.bundle.minSumInsured);
    const maxSumInsured = BigNumber.from(props.bundle.maxSumInsured);
    const minDuration = props.bundle.minDuration / 86400;
    const maxDuration = props.bundle.maxDuration / 86400;

    return (<>
        <Grid container spacing={1}>
            <NameValue name={t('balance')} value={symbol + " " + formatCurrencyBN(balance, props.decimals)}/>
            <NameValue name={t('capital')} value={symbol + " " + formatCurrencyBN(capacity, props.decimals)}/>
            <NameValue name={t('locked')} value={symbol + " " + formatCurrencyBN(locked, props.decimals)}/>
            <NameValue name={t('min_max_sum_insured')} value={symbol + " " + formatCurrencyBN(minSumInsured, props.decimals) + " / " + formatCurrencyBN(maxSumInsured, props.decimals)}/>
            <NameValue name={t('min_max_duration')} value={minDuration + " / " + " " + maxDuration + " " + t('days')}/>
            <NameValue name={t('apr')} value={props.bundle.apr + " %"}/>
            <NameValue name={t('policies')} value={props.bundle.policies.toString()}/>
        </Grid>
    </>);
}

function NameValue(props: { name: string, value: string }) {
    return (<>
        <Grid item xs={12} md={4}>
            {props.name}
        </Grid>
        <Grid item xs={12} md={8}>
            {props.value}
        </Grid>
    </>);
}