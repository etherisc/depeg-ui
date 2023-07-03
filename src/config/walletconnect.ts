import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
console.log("wallet connect config", "chainid", chainId);

export const walletConnectProjectId = '6cf24be37dc19d58bc113806ab03aded';

// TODO: enable this
// configure walletconnect v2
// let chainsList;
// if (chainId === "80001") {
//     console.log("wallet connect config", "chainid", chainId, "polygonMumbai");
    const chainsList = [polygonMumbai];
// } else if (chainId === "1") {
//     console.log("wallet connect config", "chainid", chainId, "mainnet");
//     chainsList = [mainnet];
// } else {
//     console.log("wallet connect config", "chainid", chainId, "mainnet");
//     chainsList = [mainnet];
// }
// const chainsList = [{chainId: "eip155:80001"}];

// @ts-ignore testnet not set on mainnet chain - ignore complaint
const { chains, publicClient } = configureChains(chainsList, [w3mProvider({ projectId: walletConnectProjectId })]);
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId: walletConnectProjectId, chains }),
    publicClient
});
export const ethereumClient = new EthereumClient(wagmiConfig, chains);
