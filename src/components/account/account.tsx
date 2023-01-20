import { useEffect, useState } from "react";
import Blockies from 'react-blockies';
import { DOT, NBSP } from "../../utils/chars";
import { Box, Avatar } from "@mui/material";
import Balance from "../balance";
import Address from "../address";
import Logout from "./logout";
import { reconnectWallets } from "../../utils/wallet";
import Login from "./login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Account() {
    const dispatch = useDispatch();
    const signer = useSelector((state: RootState) => state.chain.signer);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const address = useSelector((state: RootState) => state.account.address);
    
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

    if (! loggedIn) {
        return (
            <>
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

    return (<>{account}</>);
}
