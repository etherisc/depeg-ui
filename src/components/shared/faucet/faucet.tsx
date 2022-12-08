import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/app_context";
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography'
import { DepegProduct__factory } from "../../../contracts/depeg-contracts";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";

export default function Faucet() {
    const appContext = useContext(AppContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const currency = process.env.NEXT_PUBLIC_DEPEG_USD2;

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

    if (process.env.NEXT_PUBLIC_SHOW_FAUCET !== 'true') {
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
        const snackbarId = enqueueSnackbar(t('wait_for_coins'),  { persist: true, variant: 'info' });

        console.log("calling faucet api...");
        await fetch("/api/faucet?address=" + address!);
        console.log("faucet api called");

        closeSnackbar(snackbarId);
        enqueueSnackbar(t('coins_sent'),  { autoHideDuration: 3000, variant: 'success' });
    }
    
    return (<>
        <Button variant="text" sx={{ p: 0 }} onClick={useFaucet}>
            <Typography variant="body2" sx={{ fontSize: '10px' }}>
                    {currency} faucet
            </Typography>
        </Button>
    </>);
}