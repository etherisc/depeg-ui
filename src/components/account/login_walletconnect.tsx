import WalletConnectProvider from "@walletconnect/web3-provider";import { ethers } from "ethers";
import { walletConnectConfig } from "../../config/appConfig";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useMediaQuery, useTheme } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { connectChain } from "../../redux/slices/chain_slice";
import { getChainState, removeSigner, updateSigner } from "../../utils/chain";

export default function LoginWithWalletConnectButton(props: any) {
    const { closeDialog } = props;

    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const isConnected = useSelector((state: any) => state.chain.isConnected);
    const provider = useSelector((state: any) => state.chain.provider);

    async function login() {
        console.log("wallet connect login");
        closeDialog();

        //  Create WalletConnect Provider
        const wcProvider = new WalletConnectProvider(walletConnectConfig);

        try {
            //  Enable session (triggers QR Code modal)
            await wcProvider.enable();
        } catch (error) {
            enqueueSnackbar(
                t('error.wallet_connect_failed'),
                { 
                    variant: 'warning',
                    autoHideDuration: 4000,
                    preventDuplicate: true,
                }
            );
        }

        // TODO: make this implementation more robust
        wcProvider.on("accountsChanged", async (accounts: string[]) => {
            console.log("accountsChanged", accounts);
            await provider?.send("eth_requestAccounts", []);
            updateSigner(dispatch, provider);
        });
        wcProvider.on("chainChanged", (chainId: number) => {
            console.log("chainChanged", chainId);
            if (chainId != 43113) {
                wcProvider.disconnect();
                removeSigner(dispatch);
            }
            location.reload();
        });

        // A Web3Provider wraps a standard Web3 provider, which is
        // what MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(wcProvider);
        // setSigner(appContext!!.dispatch, provider);
        dispatch(connectChain(await getChainState(provider)));
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
