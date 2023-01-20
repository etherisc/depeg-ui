import { NBSP } from "../utils/chars";
import { useSnackbar } from 'notistack';
import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { useState } from "react";

export interface AddressProps {
    address: string;
    iconColor?: string;
}

export default function Address(props: AddressProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');

    const iconColor = props.iconColor ?? "";

    
    async function copyAddressToClipboard() {
        await navigator.clipboard.writeText(props.address);
        enqueueSnackbar(t('action.address_copied'),  { autoHideDuration: 2000, variant: 'info' });
    }

    const abrAdr = `${props.address.substring(0, 6)}…${props.address.substring(props.address.length - 4)}`;
    const abrAdrMobile = `0x…${props.address.substring(props.address.length - 4)}`;

    return (
        <>
            <Box component="span" sx={{ display: { 'xs': 'none', 'md': 'inline'}}}>
                {abrAdr}
                {NBSP}
                <Typography color={iconColor} component="span">
                    <FontAwesomeIcon icon={faCopy} className="fa cursor-pointer" onClick={copyAddressToClipboard} data-testid="copy-button"/>
                </Typography>
            </Box>
            <Box component="span" sx={{ display: { 'xs': 'inline', 'md': 'none'}}}>
                {abrAdrMobile}
            </Box>
        </>
    );
}
