import { ContentCopy } from "@mui/icons-material";
import { Signer } from "ethers";
import { useState, useEffect } from "react";
import { NBSP } from "../../../utils/chars";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";

export interface AccountAddressProps {
    signer: Signer;
    address?: string;
}

export default function AccountAddress(props: AccountAddressProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');

    const [ address, setAddress ] = useState(props.address ?? "");

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await props.signer.getAddress();
            setAddress(address);
        }
        if (props.address !== null) {
            updateData();
        }
    }, [props]);
    
    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(address);
        enqueueSnackbar(t('action.address_copied'),  { autoHideDuration: 2000, variant: 'info' });
    }
    
    return (
        <>
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
            {NBSP}
            <ContentCopy onClick={copyAddressToClipboard} sx={{ fontSize: 14 }} />
        </>
    );
}