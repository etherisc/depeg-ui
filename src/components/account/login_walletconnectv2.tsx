// import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
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
import { useWeb3Modal } from "@web3modal/react";

export default function LoginWithWalletConnectV2Button(props: any) {
    const { closeDialog } = props;
    const { open } = useWeb3Modal();

    const { t } = useTranslation('common');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isConnected = useSelector((state: any) => state.chain.isConnected);

    async function login() {
        console.log("wallet connect v2 login");
        closeDialog();


        // show walletconnect v2 modal
        open();

        // console.log("wallet connect v2 login");

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
        <>{button}</>
    );
}
