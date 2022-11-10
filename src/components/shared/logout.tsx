import { useContext } from "react";
import { removeSigner, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'
import { useTranslation } from "next-i18next";

export default function Logout() {
    const signerContext = useContext(SignerContext);
    const { t } = useTranslation('common');

    const logout = async () => {
        removeSigner(signerContext!!.dispatch);
    }
        
    let button = (<></>);

    if (signerContext?.data.signer !== undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={logout}>
                {t('action.disconnect')}
            </Button>
        );
    }


    return (<>{button}</>);
}