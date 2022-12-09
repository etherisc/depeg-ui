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
import { Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function Header() {
    const { t } = useTranslation('common');
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    function getListItem(text: string, href: string) {
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton href={href}>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        );
    }

    let links = [];
    let listitems = [];

    if (router.pathname === '/' || router.pathname === '/policies') {
        if (router.pathname === '/') {
            links.push(<HeaderLink text={t('nav.link.policies')} href="/policies" key="policies" />);
            listitems.push(getListItem(t('nav.link.policies'), '/policies'));
        } else {
            links.push(<HeaderLink text={t('nav.link.apply')} href="/" key="apply" />);
            listitems.push(getListItem(t('nav.link.apply'), '/'));
        }
        links.push(<HeaderLink text={t('nav.link.invest')} href="/invest" key="invest" />);
        listitems.push(getListItem(t('nav.link.invest'), '/invest'));
    } else if (router.pathname === '/invest' || router.pathname === '/bundles') {
        links.push(<HeaderLink text={t('nav.link.apply')} href="/" key="apply" />);
        listitems.push(getListItem(t('nav.link.apply'), '/'));
        if (router.pathname === '/invest') {
            links.push(<HeaderLink text={t('nav.link.bundles')} href="/bundles" key="bundles" />);
            listitems.push(getListItem(t('nav.link.bundles'), '/bundles'));
        } else {
            links.push(<HeaderLink text={t('nav.link.invest')} href="/invest" key="invest" />);
            listitems.push(getListItem(t('nav.link.invest'), '/invest'));
        }
    }


    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
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
                        <Box sx={{ display: { xs: 'none', md: 'inherit'}}}>
                            <Image src="/etherisc_logo_white.svg" alt="Etherisc logo" width={100} height={22}  />
                        </Box>
                        <Box sx={{ display: { xs: 'inherit', md: 'none'}}}>
                            <Image src="/etherisc_logo_bird_white.svg" alt="Etherisc logo" width={22} height={22} />
                        </Box>
                        <HeaderLink text={t('apptitle_short')} href="/" variant="h6" sx={{ display: { xs: 'none', md: 'block'}}} />
                        
                        {/* links only shown on desktop */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 1 }}>
                            {links}
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, ml: 1 }}>
                        </Box>

                        {/* links only shown on desktop */}
                        <Box sx={{ flexGrow: 0 }}>
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
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            >
                {drawer}
            </Drawer>
        </Box>
        </Box>
    </>);    

}