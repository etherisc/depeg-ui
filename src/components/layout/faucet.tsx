import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography'
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { Button } from "@mui/material";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faFaucet, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DOT } from "../../utils/chars";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import WithTooltip from "../with_tooltip";

export default function Faucet() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const currency = process.env.NEXT_PUBLIC_FAUCET_SYMBOL;
    const coinAddress = process.env.NEXT_PUBLIC_FAUCET_COIN_ADDRESS;

    const chainTokenSymbol = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL;
    const chainTokenFaucetUrl = process.env.NEXT_PUBLIC_CHAIN_TOKEN_FAUCET_URL;

    const signer = useSelector((state: RootState) => state.chain.signer);

    const [ address, setAddress ] = useState<string|undefined>(undefined);

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await signer?.getAddress();
            setAddress(address!);
        }
        if (signer !== undefined) {
            updateData();
        } else {
            setAddress(undefined);
        }
    }, [signer]);

    if (process.env.NEXT_PUBLIC_SHOW_FAUCET !== 'true') {
        return (<></>);
    }

    if (address === undefined) {
        return (<></>);
    }

    async function useFaucet() {
        const snackbarId = enqueueSnackbar(t('wait_for_coins'),  { persist: true, variant: 'info' });

        console.log("calling faucet api...");
        await fetch("/api/faucet?address=" + address!);
        console.log("faucet api called");

        closeSnackbar(snackbarId);
        enqueueSnackbar(t('coins_sent'),  { autoHideDuration: 3000, variant: 'success' });
    }

    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(coinAddress!);
        enqueueSnackbar(t('action.address_copied'),  { autoHideDuration: 2000, variant: 'info' });
    }
    
    return (<>
        <Button variant="text" sx={{ p: 0 }} >
            <WithTooltip tooltipText={t('help.faucet', { currency: currency })}>
                <Typography variant="body2" sx={{ fontSize: '10px' }} onClick={useFaucet}>
                    {currency} faucet
                    <FontAwesomeIcon icon={faFaucet} className="fa cursor-pointer" />
                </Typography>
            </WithTooltip>
            <Typography variant="body2" sx={{ fontSize: '10px' }} onClick={copyAddressToClipboard} title={t('help.faucet_copy', { currency: currency })}>
                <FontAwesomeIcon icon={faCopy} className="fa cursor-pointer" />
            </Typography>
        </Button>
        <Typography variant="body2" sx={{ fontSize: '10px' }} >
            {DOT}
        </Typography>
        <Button variant="text" sx={{ p: 0, ml: 1 }} href={chainTokenFaucetUrl!} target="_blank" rel="noreferrer">
            <Typography variant="body2" sx={{ fontSize: '10px' }} >
                {chainTokenSymbol} faucet
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa cursor-pointer" />
            </Typography>
        </Button>
    </>);
}