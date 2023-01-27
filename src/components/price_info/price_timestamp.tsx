import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import moment from "moment";
import { useTranslation } from "next-i18next";

interface PriceTimestampProps {
    timestamp: number;
    triggeredAt: number;
    depeggedAt: number;
}

export default function PriceTimestamp(props: PriceTimestampProps) {
    const { t } = useTranslation(['price', 'common']);

    const timestampStr = moment.utc(props.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss UTC");
    const triggeredAtStr = props.triggeredAt > 0 ?
        moment.utc(props.triggeredAt * 1000).format("YYYY-MM-DD HH:mm:ss UTC")
        : undefined;
    const depeggedAtStr = props.depeggedAt > 0 ?
        moment.utc(props.depeggedAt * 1000).format("YYYY-MM-DD HH:mm:ss UTC")
        : undefined;

    return(<Box sx={{ display: 'inline-flex'}}>
        <Typography variant="body2" color={grey[700]} sx={{ placeSelf: 'baseline' }}>
            {t('timestamp.latest')} {timestampStr}
        </Typography>
        { props.triggeredAt > 0 && props.depeggedAt == 0 &&
            <Typography variant="body2" color={grey[700]} sx={{ placeSelf: 'baseline' }}>
                &nbsp;/&nbsp;{t('timestamp.triggered')} {triggeredAtStr}
            </Typography>
        }
        { props.depeggedAt > 0 &&
            <Typography variant="body2" color={grey[700]} sx={{ placeSelf: 'baseline' }}>
                &nbsp;/&nbsp;{t('timestamp.depegged')} {depeggedAtStr}
            </Typography>
        }   
    </Box>)
}