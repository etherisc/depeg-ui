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

export default function Header() {

    const pages = ['Products', 'Pricing', 'Blog'];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Etherisc Depeg Protection
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