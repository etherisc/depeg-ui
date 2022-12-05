import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/app_context";
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography'
import { ethers, Signer } from 'ethers';
import { transferAmount } from "../../../backend/erc20";
import { DepegProduct__factory } from "../../../contracts/depeg-contracts";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { parseEther } from "ethers/lib/utils";

export default function Faucet() {
    const appContext = useContext(AppContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useTranslation('common');

    const [ address, setAddress ] = useState<string|undefined>(undefined);

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await appContext?.data.signer?.getAddress();
            setAddress(address!);
        }
        if (appContext?.data.signer !== undefined) {
            updateData();
        } else {
            setAddress(undefined);
        }
    }, [appContext?.data.signer]);

    if (process.env.NEXT_PUBLIC_CHAIN_RPC_URL === undefined) {
        return (<></>);
    }

    if (address === undefined) {
        return (
            <></>
        );
    }

    async function getTokenAddress() {
        const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "0x00";
        const depegProduct = DepegProduct__factory.connect(depegProductContractAddress, appContext.data.signer!);
        return await depegProduct.getToken();
    }

    async function useFaucet() {
        // TODO: init coin source account (and do not allow undefined)
        const coinSourceSigner: Signer | undefined = ethers.Wallet.fromMnemonic(process.env.NEXT_PUBLIC_FAUCET_MNEMONIC ?? "").connect(appContext.data.provider!);

        const snackbarId = enqueueSnackbar(t('wait_for_coins'),  { persist: true, variant: 'info' });

        if (process.env.NEXT_PUBLIC_FAUCET_SEND_ETHERS === "true") {
        // transfer some eth to pay for trx
            let ethTx = {
                to: address!,
                gasLimit: 50000,
                value: parseEther("10.0") // 10 ETH
            };
            console.log("sending eth to", ethTx.to);
            const tx = await coinSourceSigner!.sendTransaction(ethTx);
            await tx.wait();
        }

        if (process.env.NEXT_PUBLIC_FAUCET_SEND_TESTCOIN === "true") {
            // transfer some testcoin
            const tokenAddress = await getTokenAddress();
            transferAmount(address!, 1000000000000, tokenAddress, coinSourceSigner!);  // 1'000'000 DEP
        }
        
        closeSnackbar(snackbarId);
        enqueueSnackbar(t('coins_sent'),  { autoHideDuration: 3000, variant: 'success' });
    }
    
    return (<>
        <Button variant="text" sx={{ p: 0 }} onClick={useFaucet}>
            <Typography variant="body2" sx={{ fontSize: '10px' }}>
                    Coin faucet
            </Typography>
        </Button>
    </>);
}