// import { StaticJsonRpcProvider } from '@ethersproject/providers';
// import { chains, providers } from '@web3modal/ethereum';

// export const fujiEthProvider = new StaticJsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const chainUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;

console.log("wallet connect config", "chainid", chainId, "chainUrl", chainUrl);

export const walletConnectConfig = {
    projectId: '6cf24be37dc19d58bc113806ab03aded',
    rpc: {
        chainId: chainUrl, // main chain connection
        "1": "https://main-light.eth.linkpool.io/",
        "5": "https://goerli-light.eth.linkpool.io/", // goerli
        "80001": "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78", // mumbai
    },
};

export const REGEX_PATTERN_NUMBER_WITHOUT_DECIMALS = /^[0-9]+$/;
export const REGEX_PATTERN_NUMBER_WITH_TWO_DECIMALS = /^[0-9]+(\.[0-9]{0,2})?$/;