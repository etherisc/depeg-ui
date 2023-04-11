import { Web3Provider } from "@ethersproject/providers";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { ethers, providers, Signer } from "ethers";
import { resetAccount, setAccount, updateBalance } from "../redux/slices/account";
import { ChainState, connectChain, disconnectChain, setBlock, updateSigner as updateSignerSlice } from "../redux/slices/chain";
import { expectedChain } from "./const";
import { toHex } from "./numbers";
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export async function getChainState(provider: Web3Provider): Promise<ChainState> {
    const signer = provider.getSigner(); 
    const chainId = (await provider.getNetwork()).chainId;
    return getChainStateWithSigner(provider, chainId, signer);
}

export async function getChainStateWithSigner(provider: providers.Provider, chainId: number, signer: Signer): Promise<ChainState> {
    // const network = await provider.getNetwork();
    const hexChainId = toHex(chainId);
    const blockNumber = await provider.getBlockNumber();
    const blockTime = (await provider.getBlock(blockNumber)).timestamp;

    return {
        chainId: hexChainId,
        isConnected: true,
        isExpectedChain: hexChainId === expectedChain,
        provider: provider,
        signer: signer,
        blockNumber: blockNumber,
        blockTime: blockTime,
    } as ChainState;
}


export async function getAndUpdateBlock(dispatch: Dispatch<AnyAction>, provider: providers.Provider, blockNumber: number) {
    const blockTime = (await provider.getBlock(blockNumber)).timestamp;
    dispatch(setBlock([blockNumber, blockTime ]));
}

export async function setSigner(dispatch: Dispatch<AnyAction>, provider: providers.Web3Provider) {
    const signer = provider.getSigner(); 
    console.log("set signer", signer);
    dispatch(connectChain(await getChainState(provider)));
    setAccountRedux(signer, dispatch);
}

export async function updateSigner(dispatch: Dispatch<AnyAction>, provider: providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("update signer", signer);
    dispatch(updateSignerSlice(signer));
    setAccountRedux(signer, dispatch);
}

export function removeSigner(dispatch: Dispatch<AnyAction>) {
    // dispatch({ type: AppActionType.UNSET });
    dispatch(disconnectChain());
    dispatch(resetAccount());
    console.log("unset signer");
    window.localStorage.clear();
}

export async function setAccountRedux(signer: Signer, dispatch: Dispatch<AnyAction>): Promise<void> {
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    const tokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL ?? "ETH";
    const decimals = process.env.NEXT_PUBLIC_CHAIN_TOKEN_DECIMALS ?? "18";
    dispatch(setAccount([address, balance.toString(), tokenSymbol, parseInt(decimals)]));
}

export async function updateAccountBalance(signer: Signer, dispatch: Dispatch<AnyAction>): Promise<void> {
    const balance = await signer.getBalance();
    const tokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL ?? "ETH";
    const decimals = process.env.NEXT_PUBLIC_CHAIN_TOKEN_DECIMALS ?? "18";
    dispatch(updateBalance([balance.toString(), tokenSymbol, parseInt(decimals)]));
}

/**
 * Returns a signer that is connected to the chain defined in the env variable NEXT_PUBLIC_CHAIN_RPC_URL.
 * 
 * @returns a signer that can be used to sign transactions but cannot send them
 */
export async function getVoidSigner(): Promise<Signer> {
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    return new ethers.VoidSigner("0x0000000000000000000000000000000000000000", provider);
}

/**
 * Returns a signer that is connected to the chain defined in the env variable NEXT_PUBLIC_CHAIN_RPC_URL.
 * 
 * @returns a signer that can be used to sign transactions but cannot send them
 */
export async function getBackendVoidSigner(): Promise<Signer> {
    const provider = new StaticJsonRpcProvider(process.env.BACKEND_CHAIN_RPC_URL || process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    return new ethers.VoidSigner("0x0000000000000000000000000000000000000000", provider);
}


export async function getLastBlockTimestamp(signer: Signer): Promise<number> {
    const blockNumber = await signer.provider?.getBlockNumber() ?? 0;
    const block = await signer.provider?.getBlock(blockNumber);
    return block?.timestamp ?? 0;
}