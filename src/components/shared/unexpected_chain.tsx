import { Alert, AlertTitle } from "@mui/material";
import { t } from "i18next";
import { useTranslation } from "next-i18next";

export default function UnexpectedChain() {
    const { t } = useTranslation('common');

    return (
        <div>
            <Alert variant="filled" severity="error">
                <AlertTitle>{t('error.unexpected_network_title')}</AlertTitle>
                {t('error.unexpected_network', { network: process.env.NEXT_PUBLIC_CHAIN_NAME})}
            </Alert>
        </div>
    );
}