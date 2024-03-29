import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { formatDateTimeLocal, formatDateTimeUtc, formatDateUtc } from "../utils/date";

interface TimestampProps {
    at: number;
    withTime?: boolean;
}

export default function Timestamp(props: TimestampProps) {   
    const localDateTime = formatDateTimeLocal(props.at);
    let utcDate = formatDateUtc(props.at);
    if (props.withTime) {
        utcDate = formatDateTimeUtc(props.at);
    }
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