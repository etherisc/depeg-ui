import { Web3Provider } from "@ethersproject/providers";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { providers } from "ethers";
import { ChainState, connectChain, disconnectChain, setBlock, updateSigner as updateSignerSlice } from "../redux/slices/chain_slice";
import { expectedChain } from "./const";
import { toHex } from "./numbers";

export async function getChainState(provider: Web3Provider): Promise<ChainState> {
    const signer = provider.getSigner(); 
    const network = await provider.getNetwork();
    const chainId = toHex(network.chainId);
    const blockNumber = await provider.getBlockNumber();
    const blockTime = (await provider.getBlock(blockNumber)).timestamp;

    return {
        chainId: chainId,
        isConnected: true,
        isExpectedChain: chainId === expectedChain,
        provider: provider,
        signer: signer,
        blockNumber: blockNumber,
        blockTime: blockTime,
    } as ChainState;
}


export async function getAndUpdateBlock(dispatch: Dispatch<AnyAction>, provider: providers.Web3Provider, blockNumber: number) {
    const blockTime = (await provider.getBlock(blockNumber)).timestamp;
    dispatch(setBlock([blockNumber, blockTime ]));
}

export async function setSigner(dispatch: Dispatch<AnyAction>, provider: providers.Web3Provider) {
    const signer = provider.getSigner(); 
    console.log("set signer", signer);
    dispatch(connectChain(await getChainState(provider)));
}

export function updateSigner(dispatch: Dispatch<AnyAction>, provider: providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("update signer", signer);
    dispatch(updateSignerSlice(signer));
}

export function removeSigner(dispatch: Dispatch<AnyAction>) {
    // dispatch({ type: AppActionType.UNSET });
    dispatch(disconnectChain());
    console.log("unset signer");
    window.localStorage.clear();
}
