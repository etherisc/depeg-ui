import { useContext } from "react";
import { AppContext } from "../../context/app_context";
import Button from '@mui/material/Button'
import { getAndSetWalletAccount } from "../../utils/wallet";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery, useTheme } from "@mui/material";

export default function LoginWithMetaMaskButton(props: any) {
    const { closeDialog } = props;
    const appContext = useContext(AppContext);
    const { t } = useTranslation('common');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    async function login() {
        console.log("metamask login");
        closeDialog();

        // @ts-ignore
        if (!window.ethereum) {
            enqueueSnackbar(
                (<span>{t('error.metamask_not_found')} <a href="https://metamask.io/" target="_blank" rel="noreferrer">https://metamask.io/</a></span>),  
                { 
                    variant: 'error', 
                    persist: true, 
                    preventDuplicate: true,
                    action: (key) => {
                        return (
                            <Button onClick={() => {closeSnackbar(key)}}>{t('action.hide')}</Button>
                        );
                    }
                }
            );
            return;
        }

        getAndSetWalletAccount(appContext?.dispatch);
    }

    let button = (<></>);
    let buttonText = t('action.login_metamask');
    
    if (isMobile) {
        buttonText = t('action.login_metamask_short');
    }
    
    if (appContext?.data.signer === undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={login} sx={{ mr: 1}} fullWidth>
                <FontAwesomeIcon icon={faRightToBracket} className="fa" />
                {buttonText}
            </Button>
        );
    }

    return (
        <>{button}</>
    );
}