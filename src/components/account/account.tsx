import { Avatar, Box } from "@mui/material";
import { useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { RootState } from "../../redux/store";
import { DOT, NBSP } from "../../utils/chars";
import { reconnectWallets } from "../../utils/wallet";
import Address from "../address";
import Balance from "../balance";
import Login from "./login";
import Logout from "./logout";
import WagmiAccount from "./wagmi_account";

export default function Account() {
    const dispatch = useDispatch();
    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const address = useSelector((state: RootState) => state.account.address);
    
    // wagmi - we're all gonna make it :-)
    const { isConnected: wagmiIsConnected } = useAccount();

    const [ loggedIn, setLoggedIn ] = useState(false);

    useEffect(() => {
        console.log("signer changed");
        if (isConnected) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [signer, isConnected]);

    useEffect(() => {
        reconnectWallets(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // web3model connections are not available in the first render 
    const [wagmiConnected, setWagmiConnected] = useState(false);
    useEffect(() => {
        console.log("zz wagmi isConnected", wagmiIsConnected);
        setTimeout(() => setWagmiConnected(wagmiIsConnected), 100);
    }, [wagmiIsConnected, setWagmiConnected]);

    if (! loggedIn) {
        return (
            <>
                {wagmiConnected && <WagmiAccount />}
                <Login />
            </>
        );
    }

    let account = (<></>);

    if (isConnected && address !== undefined && address !== "") {
        account = (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1, display: { 'xs': 'none', 'md': 'inline-flex'} }} >
                    <Blockies seed={address} size={10} scale={4} />
                </Avatar>
                <Box sx={{ mr: 1, alignItems: 'center', verticalAlign: 'middle' }}>
                    <Address address={address}/>
                    <Box component="span" sx={{ display: { 'xs': 'none', 'md': 'inline-flex'}}}>
                        {NBSP} {DOT} {NBSP}
                        <Balance />
                    </Box>
                </Box>
                <Logout />
            </Box>
        );
    }

    return (<>
        {/* {wagmiConnected && <WagmiAccount />} */}
        {account}
    </>);
}
