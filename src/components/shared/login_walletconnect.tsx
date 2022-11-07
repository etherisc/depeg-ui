import WalletConnectProvider from "@walletconnect/web3-provider";import { ethers } from "ethers";
import { useContext } from "react";
import { walletConnectConfig } from "../../config/appConfig";
import { SignerContext, SignerActionType } from "../../context/signer_context";
import Button from '@mui/material/Button'

export default function LoginWithWalletConnectButton() {
    const signerContext = useContext(SignerContext);

    async function login() {
        console.log("wallet connect login");

        //  Create WalletConnect Provider
        const wcProvider = new WalletConnectProvider(walletConnectConfig);

        //  Enable session (triggers QR Code modal)
        await wcProvider.enable();
        // TODO: make this implementation more robust
        wcProvider.on("accountsChanged", async (accounts: string[]) => {
            console.log("accountsChanged", accounts);
            
            await signerContext?.data.provider?.send("eth_requestAccounts", []);
            
            console.log("getting signer");
            // The MetaMask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, you need the account signer...
            const signer = provider.getSigner();  
            console.log(signer);
            signerContext!!.dispatch({ type: SignerActionType.UPDATE_SIGNER, signer: signer });
        });
        wcProvider.on("chainChanged", (chainId: number) => {
            console.log("chainChanged", chainId);
            if (chainId != 43113) {
                console.log('not fuji');
                wcProvider.disconnect();
                signerContext!!.dispatch({ type: SignerActionType.UNSET });
                window.localStorage.clear();  
            }
        });

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(wcProvider);

        // MetaMask requires requesting permission to connect users accounts
        // await provider.send("eth_requestAccounts", []);

        console.log("getting wc signer");
        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        signerContext?.dispatch({ type: SignerActionType.SET, signer: signer, provider: provider });
    }

    // TODO: handle abort connection

    let button = (<></>);
    
    if (signerContext?.data.signer === undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={login}>
                Connect with Wallet Connect
            </Button>
        );
    }

    return (
        <>{button}</>
    );
}