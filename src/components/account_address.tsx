import { ContentCopy } from "@mui/icons-material";
import { Signer } from "ethers";
import { useState, useEffect } from "react";
import { NBSP } from "../utils/chars";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

export interface AccountAddressProps {
    signer: Signer;
    address?: string;
    iconColor?: string;
}

export default function AccountAddress(props: AccountAddressProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');

    const [ address, setAddress ] = useState(props.address ?? "");
    const iconColor = props.iconColor ?? "";

    useEffect(() => {
        console.log("signer changed");
        async function updateData() {
            const address = await props.signer.getAddress();
            setAddress(address);
        }
        if (props.address !== null) {
            updateData();
        }
    }, [props]);

    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(address);
        enqueueSnackbar(t('action.address_copied'),  { autoHideDuration: 2000, variant: 'info' });
    }

    const abrAdr = `${address.substring(0, 6)}…${address.substring(address.length - 4)}`;
    const abrAdrMobile = `0x…${address.substring(address.length - 4)}`;

    return (
        <>
            <Box component="span" sx={{ display: { 'xs': 'none', 'md': 'inline'}}}>
                {abrAdr}
                {NBSP}
                <Typography color={iconColor} component="span">
                    <FontAwesomeIcon icon={faCopy} className="fa cursor-pointer" onClick={copyAddressToClipboard} />
                </Typography>
            </Box>
            <Box component="span" sx={{ display: { 'xs': 'inline', 'md': 'none'}}}>
                {abrAdrMobile}
            </Box>
        </>
    );
}
