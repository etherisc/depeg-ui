import { ethers } from "ethers";
import { useContext } from "react";
import { SignerActionType, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'

export default function LoginWithMetaMaskButton() {
    const signerContext = useContext(SignerContext);

    async function login() {
        console.log("metamask login");

        // @ts-ignore
        if (!window.ethereum) {
            alert("Please install MetaMask first.");
            return;
        }

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        console.log("getting signer");
        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        const signer = provider.getSigner();
        signerContext?.dispatch({ type: SignerActionType.SET, signer: signer, provider: provider });
    }

    let button = (<></>);
    
    if (signerContext?.data.signer === undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={login} sx={{ mr: 1}} >
                Connect with Metamask
            </Button>
        );
    }

    return (
        <>{button}</>
    );
}