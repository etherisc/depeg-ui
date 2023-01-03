import { AppContext } from "../context/app_context";
import { setSigner, updateSigner } from "../context/app_context";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { walletConnectConfig } from "../config/appConfig";
import { connectChain } from "../redux/slices/chain_slice";
import { getChainState } from "./chain";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";


export async function reconnectWallets(dispatch: Dispatch<AnyAction>) {
    // @ts-ignore
    if (window.ethereum !== undefined) {
        // try browser wallet reconnection first (metamask, ...)
        // @ts-ignore: window.ethereum is injected by metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum); 
        console.log("check if browser wallet reconnection is possible");
        const hasAccounts = (await provider.send("eth_accounts", [])).length > 0;
        console.log("hasAccounts", hasAccounts);
        if (hasAccounts) {
            console.log("reconnect browser wallet");
            getAndSetWalletAccount(dispatch);
            return;
        }
    }

    // try walletconnect reconnection
    console.log("check if walletconnect reconnection is possible");
    const wcProvider = new WalletConnectProvider(walletConnectConfig);
    const hasWcAccounts = wcProvider.wc.accounts.length > 0;
    console.log("hasWcAccounts", hasWcAccounts);
    if (hasWcAccounts) {
        console.log("reconnect walletconnect");
        await wcProvider.enable();
        const provider = new ethers.providers.Web3Provider(wcProvider);
        dispatch(connectChain(await getChainState(provider)));
        // TODO: remove setSigner(appContext!!.dispatch, provider);
    }
}

export async function getAndSetWalletAccount(dispatch: Dispatch<AnyAction>) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    // TODO: remove setSigner(dispatch, provider);
    dispatch(connectChain(await getChainState(provider)));
}

export async function getAndUpdateWalletAccount(dispatch: any) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    // FIXME: this
    updateSigner(dispatch, provider);
}
