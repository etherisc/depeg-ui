import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TrxType } from "../types/trxtype";

export default function useTransactionNotifications() {
    const { t } = useTranslation('bundles');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const trxIsActive = useSelector((state: RootState) => state.transaction.isActive);
    const trxIsWaitingForUser = useSelector((state: RootState) => state.transaction.isWaitingForUser);
    const trxWaitingForUserParams = useSelector((state: RootState) => state.transaction.waitingForUserParams);
    const trxIsWaitingForTransaction = useSelector((state: RootState) => state.transaction.isWaitingForTransaction);
    const trxWaitingForTransactionParams = useSelector((state: RootState) => state.transaction.waitingForTransactionParams);

    useEffect(() => {
        console.log("trxIsActive", trxIsActive);
        if (trxIsActive !== null) {
            if (trxIsActive === TrxType.BUNDLE_LOCK) {
                if (trxIsWaitingForUser) {
                    const key = enqueueSnackbar(
                        t('lock_info', { trxWaitingForUserParams }),
                        { variant: "warning", persist: true }
                    );
                } else if (trxIsWaitingForTransaction) {
                    closeSnackbar();
                    enqueueSnackbar(
                        t('apply_wait'),
                        { variant: "info", persist: true }
                    );
                } else {
                    closeSnackbar();
                }
            }
        } else {
            closeSnackbar();
        }
    }, [
        trxIsActive, trxIsWaitingForUser, trxWaitingForUserParams, trxIsWaitingForTransaction, trxWaitingForTransactionParams,
        enqueueSnackbar, closeSnackbar, t
    ]);

}