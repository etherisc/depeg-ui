
import { Alert, AlertTitle, Button, Paper } from "@mui/material";
import Box from "@mui/system/Box";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { toHexString } from "../../utils/numbers";

export default function UnexpectedChain() {
    const { t } = useTranslation('common');
    const [switchError, setSwitchError] = useState<string>();
    const [switching, setSwitching] = useState(false);
    const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME;
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    const chainRpcUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
    const tokenName = process.env.NEXT_PUBLIC_CHAIN_TOKEN_NAME;
    const tokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL;
    const tokenDecimals = parseInt(process.env.NEXT_PUBLIC_CHAIN_TOKEN_DECIMALS ?? '0');
    const blockExplorerUrl = process.env.NEXT_PUBLIC_CHAIN_TOKEN_BLOCKEXPLORER_URL;
    const allowAutoAdd = chainRpcUrl?.startsWith('https://'); // adding chain only works for https rpc URLs

    async function switchNetwork() {
        setSwitchError(undefined);
        setSwitching(true);

        try {
            const ethereum = (window as any).ethereum;
            if (!ethereum) {
                throw new Error(t('error.wallet_provider_missing'));
            }

            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: toHexString(chainId ?? '0') }],
            });
        } catch(switchError) {
            if (allowAutoAdd && isUnrecognizedChainError(switchError)) {
                try {
                    await addNetwork();
                } catch(addError) {
                    setSwitchError(getWalletErrorMessage(addError));
                }
            } else {
                setSwitchError(getWalletErrorMessage(switchError));
            }
        } finally {
            setSwitching(false);
        }
    }

    async function addNetwork() {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            throw new Error(t('error.wallet_provider_missing'));
        }

        await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: toHexString(chainId ?? '0'),
                    chainName: chainName ?? 'Unknown',
                    rpcUrls: [chainRpcUrl],
                    nativeCurrency: {
                        name: tokenName ?? 'Unknown',
                        symbol: tokenSymbol ?? 'Unknown',
                        decimals: tokenDecimals 
                    },
                    blockExplorerUrls: [blockExplorerUrl]      
                },
            ],
        });
    }

    function isUnrecognizedChainError(error: any): boolean {
        return error?.code === 4902 || error?.data?.originalError?.code === 4902;
    }

    function getWalletErrorMessage(error: any): string {
        return error?.data?.originalError?.message ?? error?.message ?? t('error.switch_network_failed');
    }

    return (
        <div>
            <Paper elevation={1} >
                <Alert severity="warning">
                    <AlertTitle>{t('error.unexpected_network_title')}</AlertTitle>
                    {t('error.unexpected_network', { network: chainName})}
                    <Box sx={{ pt: 2 }}>
                        <Button variant="contained" color="secondary" onClick={switchNetwork} disabled={switching}>
                            {t('action.switch_network', { network: chainName})}
                        </Button>
                    </Box>
                    {switchError && (
                        <Box sx={{ pt: 2 }}>
                            <Alert severity="error">{switchError}</Alert>
                        </Box>
                    )}
                </Alert>
            </Paper>
        </div>
    );
}
