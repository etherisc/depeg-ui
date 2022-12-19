import { Box, Icon, SvgIcon, Typography } from "@mui/material";
import { Link } from '@mui/material';
import { LinkBehaviour } from "../link_behaviour";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";


export function HeaderLink(props: any) {
    const { text, href, variant, icon } = props;

    let iconElement = undefined;
    if (icon) {
        iconElement = <FontAwesomeIcon icon={icon} className="fa" />;
    }

    return (
        <Link component={LinkBehaviour} href={href}>
            <Typography
                variant={variant ?? "subtitle1"}
                noWrap
                sx={{
                    ml: 2,
                    mr: 2,
                    display: { xs: 'none', md: 'inline-flex' },
                    color: '#eee',
                    textDecoration: 'none',
                }}
            >
                <Box>
                    {iconElement}
                    {text}
                </Box>
            </Typography>
        </Link>
    );
}