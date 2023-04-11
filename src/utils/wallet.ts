import { Signer, ethers } from "ethers";
import { connectChain } from "../redux/slices/chain";
import { getAndUpdateBlock, getChainState, getChainStateWithSigner, setAccountRedux, updateSigner } from "./chain";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { providers } from 'ethers';
import { expectedChain } from "./const";

export async function reconnectWallets(dispatch: Dispatch<AnyAction>, 
    ) {
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

    // console.log("wagmiIsConnected", wagmiIsConnected);
    // if (wagmiIsConnected) {
    //     dispatch(connectChain(await getChainStateWithSigner(wagmiProvider, wagmiSigner)));
    //     setAccountRedux(wagmiSigner, dispatch);

    //     // TODO: fix this
    //     // provider.on("block", (blockNumber: number) => {
    //     //     getAndUpdateBlock(dispatch, provider, blockNumber);
    //     // });
    // }

    // TODO: remove this
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

export async function reconnectWeb3Modal(dispatch: Dispatch<AnyAction>, 
    chainId: number, wagmiProvider: providers.Provider, wagmiSigner: Signer, wagmiIsConnected: boolean, wagmiAddress: `0x${string}` | undefined) {

    console.log("wagmiIsConnected", wagmiIsConnected);
    if (wagmiIsConnected && chainId === 80001) {
        dispatch(connectChain(await getChainStateWithSigner(wagmiProvider, chainId, wagmiSigner)));
        setAccountRedux(wagmiSigner, dispatch);

        wagmiProvider.on("block", (blockNumber: number) => {
            getAndUpdateBlock(dispatch, wagmiProvider, blockNumber);
        });
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
    dispatch(connectChain(await getChainState(provider)));
    setAccountRedux(provider.getSigner(), dispatch);

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
