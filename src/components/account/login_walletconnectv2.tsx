// import WalletConnectProvider from "@walletconnect/web3-provider";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery, useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { useWeb3Modal } from "@web3modal/react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

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
