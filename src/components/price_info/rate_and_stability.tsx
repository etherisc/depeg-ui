import { faCircleXmark, faCircleCheck, faCircleExclamation, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, useTheme } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useTranslation } from "next-i18next";

interface RateAndStabilityProps {
    price: string;
    decimals: number;
    triggeredAt: number;
    depeggedAt: number;
}

export default function RateAndStability(props: RateAndStabilityProps) {
    const { t } = useTranslation(['price', 'common']);
    const theme = useTheme();

    function formatWithDecimals(value: BigNumber, decimals: number) {
        const v = formatUnits(value, props.decimals);
        return (+v).toFixed(decimals);
    }

    const priceStr = formatWithDecimals(BigNumber.from(props.price), 4);
    let color = theme.palette.success.main;
    if (props.depeggedAt > 0) {
        color = theme.palette.error.main;
    } else if (props.triggeredAt > 0) {
        color = theme.palette.warning.main;
    }

    let stability = (<><FontAwesomeIcon icon={faCircleCheck} className="fa" />{t('state.stable')}</>);
    if (props.depeggedAt > 0) {
        stability = (<><FontAwesomeIcon icon={faCircleXmark} className="fa" />{t('state.depegged')}</>);
    } else if (props.triggeredAt > 0) {
        stability = (<><FontAwesomeIcon icon={faCircleExclamation} className="fa" />{t('state.triggered')}</>);
    }
    

    return (<>
        <Typography variant="subtitle1"  sx={{ placeSelf: 'baseline' }}>
            {t('rate')}:
        </Typography>
        <Typography variant="h6"  sx={{ placeSelf: 'baseline', ml: 1 }} color={color}>
            <FontAwesomeIcon icon={faDollarSign} className="fa" />{priceStr}
        </Typography>
        <Typography variant="subtitle1"  sx={{ placeSelf: 'baseline', ml: 2 }}>
            {t('stability')}:
        </Typography>
        <Typography variant="h6"  sx={{ placeSelf: 'baseline', ml: 2 }} color={color}>
            {stability}
        </Typography>
    </>)
}