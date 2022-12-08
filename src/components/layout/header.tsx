import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Account from '../account/account';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { HeaderLink } from './header_link';
import { useRouter } from 'next/router';

export default function Header() {
    const { t } = useTranslation('common');
    const router = useRouter();

    let links = [];

    if (router.pathname === '/' || router.pathname === '/policies') {
        if (router.pathname === '/') {
            links.push(<HeaderLink text={t('nav.link.policies')} href="/policies" key="policies" />);
        } else {
            links.push(<HeaderLink text={t('nav.link.apply')} href="/" key="apply" />);
        }
        links.push(<HeaderLink text={t('nav.link.invest')} href="/invest" key="invest" />);
    } else if (router.pathname === '/invest' || router.pathname === '/bundles') {
        links.push(<HeaderLink text={t('nav.link.apply')} href="/" key="apply" />);
        if (router.pathname === '/invest') {
            links.push(<HeaderLink text={t('nav.link.bundles')} href="/bundles" key="bundles" />);
        } else {
            links.push(<HeaderLink text={t('nav.link.invest')} href="/invest" key="invest" />);
        }
    }

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Image src="/etherisc_logo_white.svg" alt="Etherisc logo" width={100} height={22} />
                    <HeaderLink text={t('apptitle_short')} href="/" variant="h6" />
                    
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 1 }}>
                        {links}
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'inline-flex' }}>
                        <Account />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );    

}