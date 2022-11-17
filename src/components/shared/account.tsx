import { useContext, useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { SignerContext } from "../../context/signer_context";
import { DOT, NBSP } from "../../utils/chars";
import { Box, Avatar } from "@mui/material";
import Balance from "./onchain/balance";
import AccountAddress from "./onchain/account_address";

export default function Account() {
    const signerContext = useContext(SignerContext);

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
    
    let account = (<></>);

    if (signerContext?.data.signer != undefined && address !== undefined && address !== "") {
        account = (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1 }} >
                    <Blockies seed={address} size={10} scale={4} />
                </Avatar>
                <Box sx={{ mr: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                    <AccountAddress signer={signerContext?.data.signer} address={address}/>
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