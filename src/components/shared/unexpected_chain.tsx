import { Alert, AlertTitle, Button } from "@mui/material";
import Box from "@mui/system/Box";
import { t } from "i18next";
import { useTranslation } from "next-i18next";
import { toHexString } from "../../utils/numbers";

export default function UnexpectedChain() {
    const { t } = useTranslation('common');
    const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME;
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    const chainRpcUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
    const showAddRpcUrlButton = chainRpcUrl?.startsWith('https://'); // adding chain only works for https rpc URLs

    async function switchNetwork() {
        // @ts-ignore
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHexString(chainId ?? '0') }],
        });
    }

    async function addNetwork() {
        // @ts-ignore
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: toHexString(chainId ?? '0'),
                    chainName: chainName ?? 'Unknown',
                    rpcUrls: [chainRpcUrl],
                },
            ],
        });
    }

    const addNetworkButton = showAddRpcUrlButton ? (
        <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={addNetwork}>
            {t('action.add_network', { network: chainName})}
        </Button>
        ) : (<></>);


    return (
        <div>
            <Alert severity="warning">
                <AlertTitle>{t('error.unexpected_network_title')}</AlertTitle>
                {t('error.unexpected_network', { network: chainName})}
                <br/>
            </Alert>
            <Box sx={{ pt: 2 }} >
                <Button variant="contained" color="primary" onClick={switchNetwork}>
                    {t('action.switch_network', { network: chainName})}
                </Button>
                {addNetworkButton}
            </Box>
        </div>
    );
}