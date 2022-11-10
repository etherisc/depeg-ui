import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Account from './account';
import LoginWithMetaMaskButton from './login_metamask';
import LoginWithWalletConnectButton from './login_walletconnect';
import Logout from './logout';
import SvgIcon from '@mui/icons-material/Adb';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

export default function Header() {
    const { t } = useTranslation('common');

    const pages = ['Products', 'Pricing', 'Blog'];

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* <SvgIcon viewbox="0 0 100 20" component={}>
                        <img src="/etherisc_logo_white." alt="logo" />
                    </SvgIcon> */}
                    <Image src="/etherisc_logo_white.svg" alt="Etherisc logo" width={100} height={22} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            ml: 2,
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {t('apptitle_short')}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'inline-flex' }}>
                        <Account />
                        <Logout />
                        <LoginWithMetaMaskButton />
                        <LoginWithWalletConnectButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );    

}