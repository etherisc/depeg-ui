import { Signer } from "ethers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import { reconnectWeb3Modal } from "../../utils/wallet";
import { RootState } from "../../redux/store";

export default function WagmiAccount() {
    const wagmiProvider = useProvider();
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const { isConnected: wagmiIsConnected, address: wagmiAddress } = useAccount();
    const { data: wagmiSignerData, isSuccess: wagmiSignerIsSuccess, refetch, isFetched } = useSigner();
    const { chain } = useNetwork();
    const dispatch = useDispatch();

    console.log("wagmi - we're all gonna make it ... or die");

    useEffect(() => {
        // console.log("xxx wagmi isConnected", wagmiProvider, wagmiIsConnected, wagmiAddress, wagmiSignerIsSuccess);
        if (! isConnected && wagmiSignerIsSuccess && wagmiIsConnected && isFetched && wagmiSignerData !== null) {
            reconnectWeb3Modal(dispatch, chain?.id ?? 0, wagmiProvider, wagmiSignerData as Signer, wagmiSignerIsSuccess && wagmiIsConnected, wagmiAddress);
        } else if (wagmiIsConnected) {
            refetch();
        }

    }, [wagmiProvider, wagmiIsConnected, wagmiAddress, wagmiSignerIsSuccess, dispatch, wagmiSignerData]);

    return <></>;
}