import { Web3Provider } from "@ethersproject/providers";
import { ChainState } from "../redux/slices/chain_slice";
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