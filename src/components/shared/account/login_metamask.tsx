import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { setSigner, AppContext } from "../../../context/app_context";
import Button from '@mui/material/Button'
import { getAndSetAccount } from "../../../utils/metamask";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";

export default function LoginWithMetaMaskButton() {
    const appContext = useContext(AppContext);
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

        getAndSetAccount(appContext?.dispatch);
    }


    // useEffect(() => {
    //     console.log("metamask reconnect");
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     console.log("provider", provider);
    //     console.log("provider.getSigner", provider.getSigner());
    //     // console.log(window?.ethereum?.isConnected());
    //     // console.log(window?.ethereum?.isConnected().then((isUnlocked) => console.log("isUnlocked", isUnlocked)));
    //     provider.send("eth_accounts", []).then((accounts) => console.log("accounts", accounts));

        

    //     // async function checkSigner() {
    //     //     try {
    //     //         provider.getUncheckedSigner().getAddress().then((address) => console.log("u address", address));
    //     //         provider.getSigner().getAddress().then((address) => console.log("address", address));
    //     //     } catch (e) {
    //     //         console.log("could not get address - error", e);
    //     //     }
    //     // }
    //     // checkSigner();
        
        
    // }, []);

    let button = (<></>);
    
    if (appContext?.data.signer === undefined) {
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