import { ContentCopy } from "@mui/icons-material";
import { Signer } from "ethers";
import { useState, useEffect } from "react";
import { NBSP } from "../../utils/chars";
import { useSnackbar } from 'notistack';

export interface AccountAddressProps {
    signer: Signer;
    address?: string;
}

export default function AccountAddress(props: AccountAddressProps) {
    const { enqueueSnackbar } = useSnackbar();

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
    
    let message = (<></>);

    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(address);
        enqueueSnackbar('Address copied to clipboard',  { autoHideDuration: 2000, variant: 'info' });
    }
    
    return (
        <>
            {address} 
            {NBSP}
            <ContentCopy onClick={copyAddressToClipboard} sx={{ fontSize: 14 }} />
        </>
    );
}