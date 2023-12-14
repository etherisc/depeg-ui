import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { removeSigner } from '../../utils/chain';
// import { useDisconnect } from 'wagmi';

export default function Logout() {
    const { t } = useTranslation('common');
    const { isConnected, isWalletConnect } = useSelector((state: any) => state.chain);
    const dispatch = useDispatch();
    // const { disconnect: wagmiDisconnect } = useDisconnect();

    const logout = async () => {
        removeSigner(dispatch);
        // if (isWalletConnect) {
        //     wagmiDisconnect();
        // }
    }
        
    let button = (<></>);

    if (isConnected) {
        button = (
            <Button variant="contained" color="secondary" onClick={logout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="fa" />
                {t('action.disconnect')}
            </Button>
        );
    }


    return (<>{button}</>);
}