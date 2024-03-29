import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, useMediaQuery, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";
import LoginWithMetaMaskButton from "./login_metamask";
import LoginWithWalletConnectV2Button from "./login_walletconnectv2";

export default function Login() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [ showLoginDialog, setShowLoginDialog ] = useState(false);
    const isConnected = useSelector((state: any) => state.chain.isConnected);

    let button = (<></>);
    
    if (! isConnected ) {
        button = (
            <Button variant="contained" color="secondary" onClick={() => setShowLoginDialog(! showLoginDialog)}>
                <FontAwesomeIcon icon={faRightToBracket} className="fa" />
                {t('action.login')}
            </Button>
        );
    }

    return (<>
        {button}

        <Dialog
            open={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            max-width="sm"
        >
            <DialogTitle id="alert-dialog-title">
                {t('login_select')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Grid>
                        <Grid item xs={12}  sx={{ p: 1 }}>
                            <LoginWithMetaMaskButton closeDialog={() => setShowLoginDialog(false)} />
                        </Grid>
                        <Grid item xs={12}  sx={{ p: 1 }}>
                            <LoginWithWalletConnectV2Button closeDialog={() => setShowLoginDialog(false)} /> 
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowLoginDialog(false)}>{t('action.close')}</Button>
            </DialogActions>

        </Dialog>
    </>);
}
