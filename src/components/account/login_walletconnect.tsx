import { ethers } from "ethers";
import { walletConnectConfig } from "../../config/appConfig";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { connectChain } from "../../redux/slices/chain";
import { getAndUpdateBlock, getChainState, removeSigner, setAccountRedux, updateSigner } from "../../utils/chain";
import { store } from "../../redux/store";
import { fetchBalances } from "../../redux/thunks/account";
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWalletClient } from "wagmi";
import UniversalProvider from "@walletconnect/universal-provider";
import { polygonMumbai } from 'wagmi/chains'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { useWeb3Modal } from "@web3modal/react";
import { useState } from "react";


export default function LoginWithWalletConnectButton(props: any) {
    const { closeDialog } = props;

    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const isConnected = useSelector((state: any) => state.chain.isConnected);
    const { openConnectModal } = useConnectModal();
    const { open, close } = useWeb3Modal();


    // const { data: signer } = useSigner();

    const { data: walletClient } = useWalletClient();

    async function fetchData(walletClient: any) {
        console.log("wallet client", walletClient);
        const provider = new ethers.providers.Web3Provider(walletClient.transport);
        console.log("provider", provider);
        console.log("address", await provider.getSigner().getAddress());
    }

    // if (walletClient) {
    //     fetchData(walletClient);
    // }

    async function login() {
        console.log("wallet connect login");
        closeDialog();

        open();

        console.log("blubb");

        // const provider = await UniversalProvider.init({
        //     logger: "info",
        //     // relayUrl: "ws://<relay-url>",
        //     projectId: "6cf24be37dc19d58bc113806ab03aded",
        //     metadata: {
        //       name: "React App",
        //       description: "React App for WalletConnect",
        //       url: "https://walletconnect.com/",
        //       icons: ["https://avatars.githubusercontent.com/u/37784886"],
        //     },
        //     client: undefined, // optional instance of @walletconnect/sign-client
        //   });
        
        //   //  create sub providers for each namespace/chain
        //   await provider.connect({
        //     namespaces: {
        //       eip155: {
        //         methods: [
        //             "eth_sendTransaction",
        //             "eth_signTransaction",
        //             "eth_sign",
        //             "personal_sign",
        //             "eth_signTypedData",
        //         ],
        //         chains: ["eip155:80001"],
        //         events: ["chainChanged", "accountsChanged"],
        //         rpcMap: {
        //           80001:
        //             "https://rpc.walletconnect.com?chainId=eip155:80001&projectId=6cf24be37dc19d58bc113806ab03aded",
        //         },
        //       },
        //     //   pairingTopic: "<123...topic>", // optional topic to connect to
        //     //   skipPairing: false, // optional to skip pairing ( later it can be resumed by invoking .pair())
        //     },
        //   });

        // const provider = await EthereumProvider.init({
        //     projectId: "6cf24be37dc19d58bc113806ab03aded", // REQUIRED your projectId
        //     chains: [80001], // REQUIRED chain ids
        //     showQrModal: true,
        //     qrModalOptions: {
        //         projectId: "6cf24be37dc19d58bc113806ab03aded", // REQUIRED your projectId
        //         chains: [polygonMumbai], // REQUIRED chain ids
        //         explorerRecommendedWalletIds: [
        //             "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369"
        //         ]
        //     }
        // });

        // await provider.connect();
        
        // //  Create Web3 Provider
        // const web3Provider = new ethers.providers.Web3Provider(provider);
        // dispatch(connectChain(await getChainState(web3Provider)));
        // setAccountRedux(web3Provider.getSigner(), dispatch);
        // store.dispatch(fetchBalances(web3Provider.getSigner()));

        // if (openConnectModal) {
        //     openConnectModal();
        // }

        //  Create WalletConnect Provider
        // const wcProvider = new WalletConnectProvider(walletConnectConfig);

        // try {
        //     //  Enable session (triggers QR Code modal)
        //     await wcProvider.enable();
        // } catch (error) {
        //     enqueueSnackbar(
        //         t('error.wallet_connect_failed'),
        //         { 
        //             variant: 'warning',
        //             autoHideDuration: 4000,
        //             preventDuplicate: true,
        //         }
        //     );
        // }

        // // TODO: make this implementation more robust
        // wcProvider.on("accountsChanged", async (accounts: string[]) => {
        //     console.log("accountsChanged", accounts);
        //     await provider?.send("eth_requestAccounts", []);
        //     updateSigner(dispatch, provider);
        //     location.reload();
        // });
        // wcProvider.on("chainChanged", (chainId: number) => {
        //     console.log("chainChanged", chainId);
        //     if (chainId != 43113) {
        //         wcProvider.disconnect();
        //         removeSigner(dispatch);
        //     }
        //     location.reload();
        // });

        // // A Web3Provider wraps a standard Web3 provider, which is
        // // what MetaMask injects as window.ethereum into each page
        // const provider = new ethers.providers.Web3Provider(wcProvider);
        // dispatch(connectChain(await getChainState(provider)));
        // setAccountRedux(provider.getSigner(), dispatch);
        // store.dispatch(fetchBalances(provider.getSigner()));

        // provider.on("block", (blockNumber: number) => {
        //     getAndUpdateBlock(dispatch, provider, blockNumber);
        // });
    }

    let button = (<></>);
    let buttonText = t('action.login_walletconnect');

    if (isMobile) {
        buttonText = t('action.login_walletconnect_short');
    }
    
    if (! isConnected ) {
        button = (
            <Button variant="contained" color="secondary" onClick={login} fullWidth>
                <FontAwesomeIcon icon={faRightToBracket} className="fa" />
                {buttonText}
            </Button>
        );
    }

    return (
        <>
            <Button variant="contained" color="secondary" onClick={login} fullWidth>
                <FontAwesomeIcon icon={faRightToBracket} className="fa" />
                {buttonText}
            </Button>
        </>
    );
}
