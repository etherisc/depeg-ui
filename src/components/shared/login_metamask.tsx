import { ethers } from "ethers";
import { useContext } from "react";
import { setSigner, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'
import { getAndSetAccount } from "../../utils/metamask";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";

export default function LoginWithMetaMaskButton() {
    const signerContext = useContext(SignerContext);
    const { t } = useTranslation('common');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    async function login() {
        console.log("metamask login");

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

        getAndSetAccount(signerContext?.dispatch);
    }

    let button = (<></>);
    
    if (signerContext?.data.signer === undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={login} sx={{ mr: 1}} >
                {t('action.login_metamask')}
            </Button>
        );
    }

    return (
        <>{button}</>
    );
}