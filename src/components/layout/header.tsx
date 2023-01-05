import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Account from '../account/account';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { HeaderLink } from './header_link';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import FaucetListItem from './faucet_list_item';

interface HeaderProps {
    items: Array<[string, string, IconDefinition]>;
    title: string;
}

export default function Header(props: HeaderProps) {
    const { t } = useTranslation('common');
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    function getListItem(text: string, href: string, icon?: any) {
        let iconElement = (<></>);
        if (icon) {
            iconElement = (
                <ListItemIcon>
                    <FontAwesomeIcon icon={icon} />
                </ListItemIcon>
            );
        }

        return (
            <ListItem key={text} disablePadding>
                <ListItemButton href={href}>
                    {iconElement}
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        );
    }

    let links: Array<any> = [];
    let listitems = [];

    props.items.forEach((item, i) => {
        const [text, href, icon] = item;
        links.push(<HeaderLink text={text} href={href} key={`k-${i}`} icon={icon} />);
        listitems.push(getListItem(text, href, icon));
    });
    listitems.push(<FaucetListItem key="faucet" />);
    
    const drawer = (
        <Box onClick={handleDrawerToggle} >
            <Typography variant="h6" sx={{ my: 2, pl: 2 }}>
                {t('apptitle_short')}
            </Typography>
            <Divider />
            <List>
                {listitems}
            </List>
        </Box>
    );

    return (<>
        <Box>
            <AppBar position="static" sx={{ mb: 2 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ pr: 1 }}>
                        {/* menu icons only shown on mobile */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ mt: 0.25, display: { xs: 'none', md: 'inherit'}}}>
                            <Image src="/etherisc_logo_white.svg" alt="Etherisc logo" width={100} height={22}  />
                        </Box>
                        <Box sx={{ display: { xs: 'inherit', md: 'none'}}}>
                            <Image src="/etherisc_logo_bird_white.svg" alt="Etherisc logo" width={28} height={22} />
                        </Box>
                        <HeaderLink text={props.title} href="/" variant="h6" sx={{ display: { xs: 'none', md: 'block'}}} />

                        {/* links only shown on desktop */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 1 }}>
                            {links}
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, ml: 1 }}>
                        </Box>

                        {/* links only shown on desktop */}
                        <Box sx={{ flexGrow: 0, display: 'flex' }}>
                            <Account />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    </>);

}
