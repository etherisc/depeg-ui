import { useContext } from "react";
import { removeSigner, AppContext } from "../../context/app_context";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Logout() {
    const appContext = useContext(AppContext);
    const { t } = useTranslation('common');

    const logout = async () => {
        removeSigner(appContext.dispatch);
    }
        
    let button = (<></>);

    if (appContext?.data.signer !== undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={logout}>
                <FontAwesomeIcon icon="right-from-bracket" className="fa" />
                {t('action.disconnect')}
            </Button>
        );
    }


    return (<>{button}</>);
}