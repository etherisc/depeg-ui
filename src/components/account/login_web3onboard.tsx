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
import { getAndUpdateBlock, getChainState, removeSigner, setAccountRedux } from "../../utils/chain";
import coinbaseWalletModule from '@web3-onboard/coinbase'
import enrkypt from '@web3-onboard/enkrypt'
import gnosisModule from '@web3-onboard/gnosis'
import ledgerModule from '@web3-onboard/ledger'
import { getAndUpdateWalletAccount } from "../../utils/wallet";

// TODO: rename to web3-onboard
export default function LoginWithWeb3OnboardButton(props: any) {
    const { closeDialog } = props;

    const { t } = useTranslation('common');
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const isConnected = useSelector((state: any) => state.chain.isConnected);

    async function login() {
        console.log("web3onboard login");
        closeDialog();

        const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1");
        const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "Ethereum";
        const chainTokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL || "ETH";
        const chainUrl = process.env.NEXT_PUBLIC_CHAIN_RPC_URL;
        const injected = injectedModule();
        const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true })
        const enrkyptModule = enrkypt()
        const gnosis = gnosisModule()
        const ledger = ledgerModule()

        console.log("initializing onboard");
        const onboard = Onboard({
        wallets: [injected, coinbaseWalletSdk, enrkyptModule, gnosis, ledger],
        chains: [
            {
            id: toHex(chainId),
            token: chainTokenSymbol,
            label: chainName,
            rpcUrl: chainUrl
            }
        ]
        });
        // connect wallet
        const wallets = await onboard.connectWallet();

        console.log(wallets)

        if (wallets[0]) {
            // create an ethers provider with the connected wallet
            const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')

            dispatch(connectChain(await getChainState(ethersProvider)));
            setAccountRedux(ethersProvider.getSigner(), dispatch);

            ethersProvider.on("block", (blockNumber: number) => {
                getAndUpdateBlock(dispatch, ethersProvider, blockNumber);
            });

            ethersProvider.on('accountsChanged', function (accounts: string[]) {
                console.log('accountsChanged', accounts);
                if (accounts.length == 0) {
                    removeSigner(dispatch);
                } else {
                    getAndUpdateWalletAccount(dispatch);
                }
                location.reload();
            });
            ethersProvider.on('chainChanged', function (chain: any) {
                console.log('chainChanged', chain);
                location.reload();
            });
            ethersProvider.on('network', (newNetwork: any, oldNetwork: any) => {
                console.log('network', newNetwork, oldNetwork);
                location.reload();
            });
        }
        
        // TODO: fix ui to handle web3-onboard component
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
