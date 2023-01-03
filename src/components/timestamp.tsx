import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, Typography } from "@mui/material";
import { formatDateLocal, formatDateUtc } from "../utils/date";
import { grey } from "@mui/material/colors";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface TimestampProps {
    at: number;
}

export default function Timestamp(props: TimestampProps) {   
    const localtime = formatDateLocal(props.at);
    const utctime = formatDateUtc(props.at);
    return (<>
        {utctime}
        &nbsp;
        <Tooltip title={localtime}>
            <Typography color={grey[400]}>
                <FontAwesomeIcon icon={faCircleInfo} className="fa" />
            </Typography>
        </Tooltip>
    </>);
}