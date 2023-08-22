import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrencyBN } from "../../utils/numbers";
import Address from "../address";
import Timestamp from "../timestamp";
import WithTooltip from "../with_tooltip";
import { formatBundleState } from "../../utils/bundles";

interface BundleDetailsProps {
    bundle: BundleData;
    currency: string;
    decimals: number;
    currencyProtected: string;
    decimalsProtected: number;
}

export default function BundleDetails(props: BundleDetailsProps) {
    const { t } = useTranslation('bundles');

    const symbol = props.currency;
    const symbolProtected = props.currencyProtected;
    const capacity = BigNumber.from(props.bundle.capacity);
    const supportedCapital = BigNumber.from(props.bundle.capitalSupport);
    const balance = BigNumber.from(props.bundle.balance);
    const capital = BigNumber.from(props.bundle.capital);
    const locked = BigNumber.from(props.bundle.locked);
    const supportedCapacity = BigNumber.from(props.bundle.supportedCapacity);
    let supportedCapacityRemaining = BigNumber.from(props.bundle.supportedCapacityRemaining ?? 0);
    const minSumInsured = BigNumber.from(props.bundle.minProtectedAmount);
    const maxSumInsured = BigNumber.from(props.bundle.maxProtectedAmount);
    const minDuration = props.bundle.minDuration / 86400;
    const maxDuration = props.bundle.maxDuration / 86400;
    const createdAtTS = props.bundle.createdAt;
    const endTS = props.bundle.createdAt + BigNumber.from(props.bundle.lifetime).toNumber();

    if (supportedCapacityRemaining.lt(0)) {
        supportedCapacityRemaining = BigNumber.from(0);
    }

    return (<>
        <Grid container spacing={1} data-testid="bundle-details">
            <NameValue name={t('state')} value={<>{formatBundleState(props.bundle, t)}</>}/>
            <NameValue name={t('balance')} value={
                <>
                    {symbol + " " + formatCurrencyBN(balance, props.decimals, 2)} 
                    <WithTooltip tooltipText={t('balance_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>} />
            <NameValue name={t('capital')} value={
                <>
                    {symbol + " " + formatCurrencyBN(capital, props.decimals, 2)} 
                    <WithTooltip tooltipText={t('capital_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>} />
            <NameValue name={t('supported_capital')} value={
                <>
                    {symbol + " " + formatCurrencyBN(supportedCapital, props.decimals, 2)} 
                    <WithTooltip tooltipText={t('supported_capital_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>} />
            <NameValue name={t('locked')} value={
                <>
                    {symbol + " " + formatCurrencyBN(locked, props.decimals, 2)}
                    <WithTooltip tooltipText={t('locked_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>}  />
            <NameValue name={t('capacity')} value={
            <>
                {symbolProtected + " " + formatCurrencyBN(capacity, props.decimalsProtected, 2)}
                <WithTooltip tooltipText={t('capacity_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
            </>} />
            <NameValue name={t('supported_capacity')} value={
                <>
                    {symbolProtected + " " + formatCurrencyBN(supportedCapacity, props.decimalsProtected, 2)}
                    <WithTooltip tooltipText={t('supported_capacity_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>}  />
            <NameValue name={t('supported_capacity_remaining')} value={
                <>
                    {symbolProtected + " " + formatCurrencyBN(supportedCapacityRemaining, props.decimalsProtected, 2)}
                    <WithTooltip tooltipText={t('supported_capacity_remaining_tooltip')}><Typography color={grey[500]}><FontAwesomeIcon icon={faCircleInfo} className="fa" /></Typography></WithTooltip>
                </>} />
            <NameValue name={t('min_max_sum_insured')} value={<>{symbolProtected + " " + formatCurrencyBN(minSumInsured, props.decimalsProtected) + " / " + formatCurrencyBN(maxSumInsured, props.decimalsProtected)}</>}/>
            <NameValue name={t('min_max_duration')} value={<>{minDuration + " / " + " " + maxDuration + " " + t('days')}</>}/>
            <NameValue name={t('apr')} value={<>{props.bundle.apr + " %"}</>}/>
            <NameValue name={t('policies')} value={<>{props.bundle.policies.toString()}</>}/>
            <NameValue name={t('owner')} value={<Address address={props.bundle.owner} iconColor="secondary" />}/>
            <NameValue name={t('creation_date')} value={<Timestamp at={createdAtTS} withTime={true} />}/> 
            <NameValue name={t('open_until')} value={<Timestamp at={endTS} withTime={true} />}/>
        </Grid>
    </>);
}

function NameValue(props: { name: string, value: JSX.Element }) {
    const value = (<>{props.value}</>);

    return (<>
        <Grid item xs={5}>
            {props.name}: 
        </Grid>
        <Grid item xs={7}>
            {value}
        </Grid>
    </>);
}
