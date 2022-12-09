import { useContext, useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { AppContext } from "../../context/app_context";
import { DOT, NBSP } from "../../utils/chars";
import { Box, Avatar } from "@mui/material";
import Balance from "../balance";
import AccountAddress from "../account_address";
import LoginWithMetaMaskButton from "./login_metamask";
import LoginWithWalletConnectButton from "./login_walletconnect";
import Logout from "./logout";
import { reconnectWallets } from "../../utils/wallet";

export default function Account() {
    const appContext = useContext(AppContext);

    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ address, setAddress ] = useState("");
    const tokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL ?? "ETH";

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await appContext?.data.signer?.getAddress();
            setAddress(address!);
        }
        if (appContext?.data.signer !== undefined) {
            setLoggedIn(true);
            updateData();
        } else {
            setLoggedIn(false);
        }
    }, [appContext?.data.signer]);

    useEffect(() => {
        reconnectWallets(appContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if (! loggedIn) {
        return (
            <>
                <Box sx={{ display: { xs: 'none', md: 'inline' }}}>
                    <LoginWithMetaMaskButton />
                </Box>
                <LoginWithWalletConnectButton />
            </>
        );
    }
    
    let account = (<></>);

    if (appContext?.data.signer != undefined && address !== undefined && address !== "") {
        account = (
            <>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1 }} >
                        <Blockies seed={address} size={10} scale={4} />
                    </Avatar>
                    <Box sx={{ mr: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                        <AccountAddress signer={appContext?.data.signer} address={address}/>
                        {NBSP} {DOT} {NBSP}
                        <Balance
                            signer={appContext?.data.signer}
                            currency={tokenSymbol}
                            usdAggregatorAddress={process.env.NEXT_PUBLIC_CHAINLINK_AGGREGATOR_ETH_USD_ADDRESS!}
                            />
                    </Box>
                </Box>
                <Logout />
            </>
        );
    }

    return (<>{account}</>);
}