import { useContext, useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { AppContext } from "../../context/app_context";
import { DOT, NBSP } from "../../utils/chars";
import { Box, Avatar } from "@mui/material";
import Balance from "./onchain/balance";
import AccountAddress from "./onchain/account_address";

export default function Account() {
    const appContext = useContext(AppContext);

    const [ address, setAddress ] = useState("");

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await appContext?.data.signer?.getAddress();
            setAddress(address!);
        }
        if (appContext?.data.signer !== undefined) {
            updateData();
        }
    }, [appContext?.data.signer]);
    
    let account = (<></>);

    if (appContext?.data.signer != undefined && address !== undefined && address !== "") {
        account = (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1 }} >
                    <Blockies seed={address} size={10} scale={4} />
                </Avatar>
                <Box sx={{ mr: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                    <AccountAddress signer={appContext?.data.signer} address={address}/>
                    {NBSP} {DOT} {NBSP}
                    <Balance
                        signer={appContext?.data.signer}
                        currency="AVAX"
                        usdAggregatorAddress={process.env.NEXT_PUBLIC_CHAINLINK_AGGREGATOR_AVAX_USD_ADDRESS!}
                        />
                </Box>
            </Box>
        );
    }

    return (<>{account}</>);
}