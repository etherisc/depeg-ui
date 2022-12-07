import WalletConnectProvider from "@walletconnect/web3-provider";import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { walletConnectConfig } from "../../../config/appConfig";
import { AppContext, setSigner, removeSigner, updateSigner, AppActionType } from "../../../context/app_context";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { toHex } from "../../../utils/numbers";

export default function LoginWithWalletConnectButton() {
    const appContext = useContext(AppContext);
    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();

    async function login() {
        console.log("wallet connect login");

        //  Create WalletConnect Provider
        const wcProvider = new WalletConnectProvider(walletConnectConfig);

        try {
            //  Enable session (triggers QR Code modal)
            await wcProvider.enable();
        } catch (error) {
            enqueueSnackbar(
                t('error.wallet_connect_failed'),
                { 
                    variant: 'warning',
                    autoHideDuration: 4000,
                    preventDuplicate: true,
                }
            );
        }

        // TODO: make this implementation more robust
        wcProvider.on("accountsChanged", async (accounts: string[]) => {
            console.log("accountsChanged", accounts);
            await appContext?.data.provider?.send("eth_requestAccounts", []);
            updateSigner(appContext!!.dispatch, provider);
        });
        wcProvider.on("chainChanged", (chainId: number) => {
            console.log("chainChanged", chainId);
            if (chainId != 43113) {
                wcProvider.disconnect();
                removeSigner(appContext!!.dispatch);
            }
            appContext!!.dispatch({ type: AppActionType.CHAIN_CHANGED, chainId: toHex(chainId) });
        });

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(wcProvider);
        setSigner(appContext!!.dispatch, provider);
    }

    // useEffect(() => {
    //     console.log("wc reconnect");
    //     const wcProvider = new WalletConnectProvider(walletConnectConfig);
    //     console.log("wcProvider", wcProvider.wc.accounts);
    // }, []);

    let button = (<></>);
    
    if (appContext?.data.signer === undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={login}>
                {t('action.login_walletconnect')}
            </Button>
        );
    }

    return (
        <>{button}</>
    );
}
