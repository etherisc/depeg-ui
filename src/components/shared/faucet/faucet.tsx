import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/app_context";
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography'
import { Signer } from 'ethers';
import { transferAmount } from "../../../backend/erc20";
import { DepegProduct__factory } from "../../../contracts/depeg-contracts";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";

export default function Faucet() {
    const appContext = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
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
        const coinSource = "0x0000";
        const coinSourceSigner: Signer | undefined = undefined;

        // transfer some eth to pay for trx
        let ethTx = {
            to: address!,
            value: 10000000000000000000 // 10 ETH
        };
        const tx = await coinSourceSigner!.sendTransaction(ethTx);
        await tx.wait();

        // transfer some testcoin
        const tokenAddress = await getTokenAddress();
        transferAmount(address!, 1000000000000, tokenAddress, coinSourceSigner!);  // 1'000'000 DEP
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