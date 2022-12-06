import { Button, Link } from '@mui/material';
import Typography from '@mui/material/Typography'
import { ethers } from 'ethers';
export default function CustomChain() {

    async function addCustomChain() {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum)
    
        await provider.send("wallet_addEthereumChain", [{
            chainId: "0x" + parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1").toString(16),
            chainName: process.env.NEXT_PUBLIC_CHAIN_NAME || "Custom chain",
            nativeCurrency: {
                name: process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL,
                symbol: process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL,
                decimals: 18
            },
            rpcUrls: [process.env.NEXT_PUBLIC_CHAIN_RPC_URL],
        }]);
    }

    if (process.env.NEXT_PUBLIC_SHOW_ADD_CUSTOM_CHAIN !== 'true') {
        return (<></>);
    }

    return (
    <>
        <Button variant="text" sx={{ p: 0 }} onClick={() => addCustomChain()}>
            <Typography variant="body2" sx={{ fontSize: '10px' }}>
                    Add custom chain
            </Typography>
        </Button>
    </>);
}