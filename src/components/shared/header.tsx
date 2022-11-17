import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Account from './account';
import LoginWithMetaMaskButton from './form/login_metamask';
import LoginWithWalletConnectButton from './form/login_walletconnect';
import Logout from './form/logout';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Link } from '@mui/material';
import { LinkBehaviour } from './link_behaviour';

export default function Header() {
    const { t } = useTranslation('common');

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Image src="/etherisc_logo_white.svg" alt="Etherisc logo" width={100} height={22} />
                    <Link component={LinkBehaviour} href="/">
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                ml: 2,
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                color: '#fff',
                                textDecoration: 'none',
                            }}
                        >
                            {t('apptitle_short')}
                        </Typography>
                    </Link>
                    
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