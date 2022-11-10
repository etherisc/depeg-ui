import WalletConnectProvider from "@walletconnect/web3-provider";import { ethers } from "ethers";
import { useContext } from "react";
import { walletConnectConfig } from "../../config/appConfig";
import { SignerContext, setSigner, removeSigner, updateSigner } from "../../context/signer_context";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";

export default function LoginWithWalletConnectButton() {
    const signerContext = useContext(SignerContext);
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
            await signerContext?.data.provider?.send("eth_requestAccounts", []);
            updateSigner(signerContext!!.dispatch, provider);
        });
        wcProvider.on("chainChanged", (chainId: number) => {
            console.log("chainChanged", chainId);
            if (chainId != 43113) {
                console.log('not fuji');
                wcProvider.disconnect();
                removeSigner(signerContext!!.dispatch);
            }
        });

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(wcProvider);
        setSigner(signerContext!!.dispatch, provider);
    }

    let button = (<></>);
    
    if (signerContext?.data.signer === undefined) {
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
