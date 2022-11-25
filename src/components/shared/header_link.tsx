import { Typography } from "@mui/material";
import { Link } from '@mui/material';
import { LinkBehaviour } from "./link_behaviour";
import { Variant } from "@mui/material/styles/createTypography";

export function HeaderLink(props: any) {
    const { text, href, variant } = props;
    return (
        <Link component={LinkBehaviour} href={href}>
            <Typography
                variant={variant ?? "subtitle1"}
                noWrap
                sx={{
                    ml: 2,
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    color: '#fff',
                    textDecoration: 'none',
                }}
            >
                {text}
            </Typography>
        </Link>
    );
}