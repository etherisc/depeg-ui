import { Tooltip, Typography } from "@mui/material";

export default function WithTooltip(props: any) {
    const { tooltipText, children, typographyVariant } = props;
    return (<>
        <Tooltip title={tooltipText} enterDelay={700} leaveDelay={200} sx={{ display: 'inline-block'}}>
            <Typography variant={ typographyVariant || 'body2' } component="span">
                {children}
            </Typography>
        </Tooltip>
    </>);
}