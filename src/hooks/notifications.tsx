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

    function showPersistentErrorSnackbarWithCopyDetails(message: string, details: string): SnackbarKey {
        return enqueueSnackbar(
                    message,
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (<>
                                <Button onClick={async () => await navigator.clipboard.writeText(details) }>
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