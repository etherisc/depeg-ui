import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import Typography from '@mui/material/Typography'
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { Button } from "@mui/material";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faFaucet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Faucet() {
    const appContext = useContext(AppContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const currency = process.env.NEXT_PUBLIC_DEPEG_USD2;
    const coinAddress = process.env.NEXT_FAUCET_COIN_ADDRESS;

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

    async function useFaucet() {
        const snackbarId = enqueueSnackbar(t('wait_for_coins'),  { persist: true, variant: 'info' });

        console.log("calling faucet api...");
        await fetch("/api/faucet?address=" + address!);
        console.log("faucet api called");

        closeSnackbar(snackbarId);
        enqueueSnackbar(t('coins_sent'),  { autoHideDuration: 3000, variant: 'success' });
    }

    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(coinAddress!);
        enqueueSnackbar(t('action.address_copied'),  { autoHideDuration: 2000, variant: 'info' });
    }
    
    return (<>
        <Button variant="text" sx={{ p: 0 }} >
            <Typography variant="body2" sx={{ fontSize: '10px' }} onClick={useFaucet}>
                {currency} faucet
                <FontAwesomeIcon icon={faFaucet} className="fa cursor-pointer" />
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '10px' }} onClick={copyAddressToClipboard} title={t('help.faucet_copy', { currency: currency })}>
                <FontAwesomeIcon icon={faCopy} className="fa cursor-pointer" />
            </Typography>
        </Button>
    </>);
}