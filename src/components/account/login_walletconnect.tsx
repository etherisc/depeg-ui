// import WalletConnectProvider from "@walletconnect/web3-provider";import { ethers } from "ethers";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import { toHex } from "../../utils/numbers";
import { connectChain } from "../../redux/slices/chain";
import { getChainState, setAccountRedux } from "../../utils/chain";

// TODO: rename to web3-onboard
export default function LoginWithWalletConnectButton(props: any) {
    const { closeDialog } = props;

    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const isConnected = useSelector((state: any) => state.chain.isConnected);

    async function login() {
        console.log("wallet connect login");
        closeDialog();

        const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1");
        const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "Ethereum";
        const chainTokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL || "ETH";
        const chainUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
        const injected = injectedModule();

        const onboard = Onboard({
        wallets: [injected],
        chains: [
            {
            id: toHex(chainId),
            token: chainTokenSymbol,
            label: chainName,
            rpcUrl: chainUrl
            }
        ]
        });

        const wallets = await onboard.connectWallet();

        console.log(wallets)

        if (wallets[0]) {
            // create an ethers provider with the last connected wallet provider
            // if using ethers v6 this is:
            // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
            const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')

            dispatch(connectChain(await getChainState(ethersProvider)));
            setAccountRedux(ethersProvider.getSigner(), dispatch);
        }
        
        // TODO: accounts changed
        // TODO: chain changed
        // TODO: block update
        // TODO: fix ui to handle web3-onboard component

        // TODO: remove this
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

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        // const provider = new ethers.providers.Web3Provider(wcProvider);
        // dispatch(connectChain(await getChainState(provider)));
        // setAccountRedux(provider.getSigner(), dispatch);

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
        <>{button}</>
    );
}
