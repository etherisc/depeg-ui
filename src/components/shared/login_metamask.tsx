import { ethers } from "ethers";
import { useContext } from "react";
import { setSigner, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'
import { getAndSetAccount } from "../../utils/metamask";

export default function LoginWithMetaMaskButton() {
    const signerContext = useContext(SignerContext);

    // TODO: i18n
    
    async function login() {
        console.log("metamask login");

        // @ts-ignore
        if (!window.ethereum) {
            alert("Please install MetaMask first.");
            return;
        }

        getAndSetAccount(signerContext?.dispatch);
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