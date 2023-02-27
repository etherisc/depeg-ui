import { useTranslation } from "next-i18next";
import { SnackbarKey, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TrxType } from "../types/trxtype";

export default function useTransactionNotifications() {
    const { t } = useTranslation('common');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const trxIsActive = useSelector((state: RootState) => state.transaction.isActive);
    const trxIsWaitingForUser = useSelector((state: RootState) => state.transaction.isWaitingForUser);
    const trxWaitingForUserParams = useSelector((state: RootState) => state.transaction.waitingForUserParams);
    const trxIsWaitingForTransaction = useSelector((state: RootState) => state.transaction.isWaitingForTransaction);
    const trxWaitingForTransactionParams = useSelector((state: RootState) => state.transaction.waitingForTransactionParams);

    useEffect(() => {
        // console.log("trxIsActive", trxIsActive);
        if (trxIsActive !== null) {
            if (trxIsWaitingForUser) {
                switch (trxIsActive) {
                    case TrxType.BUNDLE_LOCK:
                        enqueueSnackbar(
                            t('lock_info', trxWaitingForUserParams as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                    case TrxType.BUNDLE_UNLOCK:
                        enqueueSnackbar(
                            t('unlock_info', trxWaitingForUserParams as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                    case TrxType.BUNDLE_CLOSE:
                        enqueueSnackbar(
                            t('close_info', trxWaitingForUserParams as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                    case TrxType.BUNDLE_BURN:
                        enqueueSnackbar(
                            t('burn_info', trxWaitingForUserParams as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                    case TrxType.BUNDLE_WITHDRAW:
                        enqueueSnackbar(
                            t('withdraw_info', trxWaitingForUserParams  as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                    case TrxType.BUNDLE_FUND:
                        enqueueSnackbar(
                            t('fund_info', trxWaitingForUserParams  as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                        break;

                        case TrxType.TOKEN_ALLOWANCE:
                            console.log(trxWaitingForUserParams);
                            enqueueSnackbar(
                                t('approval_info', trxWaitingForUserParams as Map<string, string>),
                                { variant: "warning", persist: true }
                            );
                            break;

                    default:
                        enqueueSnackbar(
                            t('trx_info', trxWaitingForUserParams as Map<string, string>),
                            { variant: "warning", persist: true }
                        );
                }
            } else if (trxIsWaitingForTransaction) {
                closeSnackbar();
                enqueueSnackbar(
                    t('wait_for_trx', { trxWaitingForTransactionParams }),
                    { variant: "info", persist: true }
                );
            }
        } else {
            closeSnackbar();
        }
    }, [
        trxIsActive, trxIsWaitingForUser, trxWaitingForUserParams, trxIsWaitingForTransaction, trxWaitingForTransactionParams,
        enqueueSnackbar, closeSnackbar, t
    ]);

}