import { useContext } from "react";
import { SignerActionType, SignerContext } from "../../context/signer_context";
import Button from '@mui/material/Button'

export default function Logout() {
    const signerContext = useContext(SignerContext);

    const logout = async () => {
        signerContext?.dispatch({ type: SignerActionType.UNSET });
        window.localStorage.clear();
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