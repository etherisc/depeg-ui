import { useContext } from "react";
import { removeSigner, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'

export default function Logout() {
    const signerContext = useContext(SignerContext);

    const logout = async () => {
        removeSigner(signerContext!!.dispatch);
    }

    let button = (<></>);

    if (signerContext?.data.signer !== undefined) {
        button = (
            <Button variant="contained" color="secondary" onClick={logout}>
                Disconnect
            </Button>
        );
    }


    return (<>{button}</>);
}