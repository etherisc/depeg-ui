import { setSigner, updateSigner } from "../context/signer_context";
import { ethers } from "ethers";

export async function getAndSetAccount(dispatch: any) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    setSigner(dispatch, provider);
}

export async function getAndUpdateAccount(dispatch: any) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    updateSigner(dispatch, provider);
}