import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Typography } from "@mui/material";
import { formatDateLocal, formatDateTimeLocal, formatDateTimeUtc, formatDateUtc } from "../utils/date";
import { grey } from "@mui/material/colors";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface TimestampProps {
    at: number;
}

export default function Timestamp(props: TimestampProps) {   
    const localDateTime = formatDateTimeLocal(props.at);
    const utcDate = formatDateUtc(props.at);
    const utcDateTime = formatDateTimeUtc(props.at);
    const tooltip = (<>{utcDateTime}<br/>{localDateTime}</>);
    return (<>
        {utcDate}
        &nbsp;
        <Tooltip title={tooltip}>
            <Typography color={grey[400]} component="span">
                <FontAwesomeIcon icon={faCircleInfo} className="fa" />
            </Typography>
        </Tooltip>
    </>);
}