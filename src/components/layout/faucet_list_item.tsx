import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

export default function FaucetListItem() {
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

    async function useFaucet() {
        const snackbarId = enqueueSnackbar(t('wait_for_coins'),  { persist: true, variant: 'info' });

        console.log("calling faucet api...");
        await fetch("/api/faucet?address=" + address!);
        console.log("faucet api called");

        closeSnackbar(snackbarId);
        enqueueSnackbar(t('coins_sent'),  { autoHideDuration: 3000, variant: 'success' });
    }

    return (
        <ListItem key={Math.random() * 1000} disablePadding>
            <ListItemButton onClick={useFaucet}>
                <ListItemIcon>
                    <FontAwesomeIcon icon={faHandHoldingDollar} />
                </ListItemIcon>
                <ListItemText primary={`${currency} faucet`} />
            </ListItemButton>
        </ListItem>
        );
}