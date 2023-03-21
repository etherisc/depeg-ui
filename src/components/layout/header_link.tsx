import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { LinkBehaviour } from "../link_behaviour";


export function HeaderLink(props: any) {
    const { text, href, variant, icon, selfAction } = props;

    const theme = useTheme();
    const showIcons = useMediaQuery(theme.breakpoints.up('lg'));
    const { asPath } = useRouter();

    let iconElement = (<></>);
    if (icon && showIcons) {
        iconElement = <FontAwesomeIcon icon={icon} className="fa" />;
    }

    const linkContent = (<Typography
            variant={variant ?? "subtitle1"}
            noWrap
            sx={{
                ml: 0,
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
        </Typography>);

    if (asPath === href) {
        return (<Link onClick={selfAction} sx={{ cursor: 'pointer' }}>
                    {linkContent}
                </Link>);
    } else {
        return (<Link href={href} component={LinkBehaviour} >
                    {linkContent}
                </Link>);
    }
}