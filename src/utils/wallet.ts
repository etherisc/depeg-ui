import { ethers } from "ethers";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { walletConnectConfig } from "../config/appConfig";
import { connectChain } from "../redux/slices/chain";
import { getAndUpdateBlock, getChainState, setAccountRedux, updateSigner } from "./chain";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { fetchBalances } from "../redux/thunks/account";
import { store } from "../redux/store";


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
    // console.log("check if walletconnect reconnection is possible");
    // const wcProvider = new WalletConnectProvider(walletConnectConfig);
    // const hasWcAccounts = wcProvider.wc.accounts.length > 0;
    // console.log("hasWcAccounts", hasWcAccounts);
    // if (hasWcAccounts) {
    //     console.log("reconnect walletconnect");
    //     await wcProvider.enable();
    //     const provider = new ethers.providers.Web3Provider(wcProvider);
    //     dispatch(connectChain(await getChainState(provider)));
    //     setAccountRedux(provider.getSigner(), dispatch);
        
    //     provider.on("block", (blockNumber: number) => {
    //         getAndUpdateBlock(dispatch, provider, blockNumber);
    //     });
    // }
}

export async function getAndSetWalletAccount(dispatch: Dispatch<AnyAction>) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    dispatch(connectChain(await getChainState(provider)));
    setAccountRedux(provider.getSigner(), dispatch);
    store.dispatch(fetchBalances(provider.getSigner()));

    provider.on("block", (blockNumber: number) => {
        getAndUpdateBlock(dispatch, provider, blockNumber);
    });
}

export async function getAndUpdateWalletAccount(dispatch: any) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    await provider.send("eth_requestAccounts", []);
    
    console.log("getting signer");
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    updateSigner(dispatch, provider);

    provider.on("block", (blockNumber: number) => {
        getAndUpdateBlock(dispatch, provider, blockNumber);
    });
}
