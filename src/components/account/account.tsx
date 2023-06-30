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
import { RootState, store } from "../../redux/store";
import { useWalletClient } from "wagmi";
import { ethers, getDefaultProvider } from "ethers";
import { connectChain } from "../../redux/slices/chain";
import { getAndUpdateBlock, getChainState, setAccountRedux } from "../../utils/chain";
import { fetchBalances } from "../../redux/thunks/account";
import { getEthersSigner } from "../../utils/walletconnect";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";

export default function Account() {
    const dispatch = useDispatch();
    const { data: walletClient } = useWalletClient();
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const address = useSelector((state: RootState) => state.account.address);
    const balance = useSelector((state: RootState) => state.account.balance);
    const balanceUsd1 = useSelector((state: RootState) => state.account.balanceUsd1);
    const balanceUsd2 = useSelector((state: RootState) => state.account.balanceUsd2);
    const balances = [balance, balanceUsd1, balanceUsd2];
    
    const [ activeBalance, setActiveBalance ] = useState(0);

    const [ loggedIn, setLoggedIn ] = useState(false);


    // useEffect(() => {
    //     async function setEthersProvider(walletClient: any) {
    //         console.log("wallet client", walletClient);
    //         const provider = new ethers.providers.Web3Provider(walletClient.transport);
    //         console.log("provider", provider);
    //         console.log("connected with address", await provider.getSigner().getAddress());
    
    //         dispatch(connectChain(await getChainState(provider)));
    //         setAccountRedux(provider.getSigner(), dispatch);
    //         store.dispatch(fetchBalances(provider.getSigner()));
    
    //         provider.on("block", (blockNumber: number) => {
    //             getAndUpdateBlock(dispatch, provider, blockNumber);
    //         });
    //     }

    //     if (! isConnected && walletClient) {
    //         setEthersProvider(walletClient);
    //     }
    // }, [isConnected, walletClient, isConnected, dispatch]);
    
    useEffect(() => {
        console.log("signer changed");
        if (isConnected) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [isConnected]);

    useEffect(() => {
        // reconnectWallets(dispatch);
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
                        <Balance balance={balances[activeBalance]} onClick={() => setActiveBalance((activeBalance + 1) % balances.length)} />
                    </Box>
                </Box>
                <Logout />
            </Box>
        );
    }

    return (<>{account}</>);
}
