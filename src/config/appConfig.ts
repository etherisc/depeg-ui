// import { StaticJsonRpcProvider } from '@ethersproject/providers';
// import { chains, providers } from '@web3modal/ethereum';

// export const fujiEthProvider = new StaticJsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const chainUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;

console.log("wallet connect config", "chainid", chainId, "chainUrl", chainUrl);

export const walletConnectConfig = {
    projectId: '6cf24be37dc19d58bc113806ab03aded',
    rpc: {
        "43113": "https://api.avax-test.network/ext/bc/C/rpc", // fuji
        "80001": "https://polygon-testnet-rpc.allthatnode.com:8545", // mumbai
        chainId: chainUrl, // main chain connection
    },
};

export const REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS = /^[0-9]+$/;
export const REGEX_PATTERN_NUMBER_WITH_DECIMALS = /^[0-9]+(\.[0-9]*)?$/;