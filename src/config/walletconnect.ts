import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { mainnet, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
console.log("wallet connect config", "chainid", CHAIN_ID);

export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

// configure walletconnect v2
let chainsList;
if (CHAIN_ID === "80001") {
    // console.log("wallet connect config", "chainid", chainId, "polygonMumbai");
    chainsList = [polygonMumbai];
} else if (CHAIN_ID === "1") {
    // console.log("wallet connect config", "chainid", chainId, "mainnet");
    chainsList = [mainnet];
} else {
    // console.log("wallet connect config", "chainid", chainId, "mainnet");
    chainsList = [mainnet];
}

// console.log("wallet connect config", "chainsList", chainsList);
// @ts-ignore testnet not set on mainnet chain - ignore complaint
const { chains, publicClient } = configureChains(chainsList, [publicProvider()]);
// console.log("wallet connect config", "chains", chains, "publicClient", publicClient);
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
    publicClient
});
// console.log("wallet connect config", "wagmiConfig", wagmiConfig);
export const ethereumClient = new EthereumClient(wagmiConfig, chains);
