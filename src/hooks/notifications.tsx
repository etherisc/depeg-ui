import { Button, useTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import { SnackbarKey, useSnackbar } from "notistack";
import WithTooltip from "../components/with_tooltip";

export default function useNotifications() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const theme = useTheme();

    function showPersistentErrorSnackbar(message: string): SnackbarKey {
        return enqueueSnackbar(
                    message,
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (
                                <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                            );
                        }
                    }
                );
    }

    function showPersistentErrorSnackbarWithCopyDetails(message: string, details: string, action: string): SnackbarKey {
        // POST to client error handler
        try {
            const body = JSON.stringify({
                message: message,
                stack: details?.toString(),
                action: action || 'unknown',
                client_timestamp : Math.floor(Date.now()),
            });
            fetch('/api/client_error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });
        } catch (e) {
            console.log("failed to POST to client error handler", e);
        }
        return enqueueSnackbar(
                    message,
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (<>
                                <Button onClick={async () => await navigator.clipboard.writeText(message + "\n" + details) }>
                                    <WithTooltip tooltipText={t('action.copy_details')}>
                                        {t('action.copy')}
                                    </WithTooltip>
                                </Button>
                                <Button onClick={() => closeSnackbar(key)}>{t('action.close', { ns: 'common' })}</Button>
                            </>);
                        }
                    }
                );
    }

    return {
        showPersistentErrorSnackbar, 
        showPersistentErrorSnackbarWithCopyDetails
    };
}