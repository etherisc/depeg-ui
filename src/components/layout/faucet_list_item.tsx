import { useEffect, useState } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function FaucetListItem() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const currency = process.env.NEXT_PUBLIC_DEPEG_USD2;

    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);

    const [ address, setAddress ] = useState<string|undefined>(undefined);

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await signer?.getAddress();
            setAddress(address!);
        }
        if (isConnected) {
            updateData();
        } else {
            setAddress(undefined);
        }
    }, [isConnected, signer]);

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