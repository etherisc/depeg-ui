import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber } from "ethers";
import { useTranslation } from "react-i18next";
import { formatAmountBN } from "../../utils/format";
import WithTooltip from "../with_tooltip";

interface StakeUsageIndicatorProps {
    /** a float indicating the usage ratio */
    stakeUsage: number | undefined; 
    lockedCapital: BigNumber;
    supportedCapital: BigNumber;
    supportedToken: string;
    supportedTokenDecimals: number;
}

export default function StakeUsageIndicator(props: StakeUsageIndicatorProps) {
    const theme = useTheme();
    const { t } = useTranslation(['common']);

    function statusIcon(stakeUsage: number | undefined) {
        if (stakeUsage === undefined || stakeUsage < 0) {
            return (<FontAwesomeIcon icon={faCircle} className="fa" style={{ color: grey[500] }} />);
        } else if (stakeUsage >= 1) {
            return (<FontAwesomeIcon icon={faCircle} className="fa" style={{ color: theme.palette.error.light }} />);
        } else if (stakeUsage >= 0.9) {
            return (<FontAwesomeIcon icon={faCircle} className="fa" style={{ color: theme.palette.warning.light }} />);
        } else {
            return (<FontAwesomeIcon icon={faCircle} className="fa" style={{ color: theme.palette.success.light }} />);
        }
    }

    function stakeUsageTooltip(stakeUsage: number | undefined, supportingAmount: BigNumber, lockedCapital: BigNumber, supportingToken: string, supportingTokenDecimals: number) {
        let usageStr = t('no_stakes');
        if (stakeUsage !== undefined) {
            usageStr = (stakeUsage! * 100).toFixed(0) + "%";
        }
        return (<>
            {t('stake_usage')}: {usageStr}<br/>
            {t('locked_capital')}: {formatAmountBN(lockedCapital, supportingToken, supportingTokenDecimals)}<br/>
            {t('supported_capital')}: {formatAmountBN(supportingAmount, supportingToken, supportingTokenDecimals)}
        </>);
    }

    return (
    <WithTooltip 
        tooltipText={stakeUsageTooltip(
            props.stakeUsage, 
            props.supportedCapital, 
            props.lockedCapital, 
            props.supportedToken, 
            props.supportedTokenDecimals)}
            >
        {statusIcon(props.stakeUsage)}
    </WithTooltip>);
}
