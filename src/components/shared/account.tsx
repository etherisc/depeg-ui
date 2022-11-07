import { ContentCopy } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { SignerContext } from "../../context/signer_context";
import { DOT, NBSP } from "../../utils/chars";
import { useSnackbar } from 'notistack';
import { Box, Avatar } from "@mui/material";
import Balance from "./balance";

export default function Account() {
    const signerContext = useContext(SignerContext);
    const { enqueueSnackbar } = useSnackbar();

    const [ address, setAddress ] = useState("");

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await signerContext?.data.signer?.getAddress();
            setAddress(address!);
        }
        if (signerContext?.data.signer !== undefined) {
            updateData();
        }
    }, [signerContext?.data.signer]);
    
    let message = (<></>);

    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(address);
        enqueueSnackbar('Address copied to clipboard',  { autoHideDuration: 2000, variant: 'info' });
    }

    let account = (<></>);

    if (signerContext?.data.signer != undefined && address !== undefined && address !== "") {
        account = (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                {message}
                <Avatar sx={{ mr: 1 }}>
                    <Blockies seed={address} size={8} scale={4} />
                </Avatar>
                <Box sx={{ mr: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                    {address} {NBSP}
                    <ContentCopy onClick={copyAddressToClipboard} sx={{ fontSize: 14 }} />
                    {NBSP} {DOT} {NBSP}
                    <Balance
                        signer={signerContext?.data.signer}
                        currency="AVAX"
                        usdAggregatorAddress={process.env.NEXT_PUBLIC_CHAINLINK_AGGREGATOR_AVAX_USD_ADDRESS!}
                        />
                </Box>
            </Box>
        );
    }

    return (<>{account}</>);
}