// import { type WalletClient, getWalletClient } from '@wagmi/core';
import { providers } from 'ethers';

export function walletClientToSigner(walletClient: unknown) {
    // const { account, chain, transport } = walletClient
    // const network = {
    //     chainId: chain.id,
    //     name: chain.name,
    //     ensAddress: chain.contracts?.ensRegistry?.address,
    // }
    // const provider = new providers.Web3Provider(transport, network)
    // const signer = provider.getSigner(account.address)
    return undefined;
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
    // const walletClient = await getWalletClient({ chainId })
    // if (!walletClient) return undefined
    // return walletClientToSigner(walletClient)
    return undefined;
}
