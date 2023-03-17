import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../util/render_with_provider';
import useTransactionNotifications from '../../src/hooks/trx_notifications';
import { TrxType } from '../../src/types/trxtype';
import { finish, start, waitingForTransaction, waitingForUser } from '../../src/redux/slices/transaction';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str: string) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        };
    },
}));

const enqueueSnackbarMock = jest.fn();
const closeSnackbarMock = jest.fn();

jest.mock('notistack', () => ({
    // ...jest.requireActual('notistack'),
    useSnackbar: () => {
        return {
            enqueueSnackbar: enqueueSnackbarMock,
            closeSnackbar: closeSnackbarMock,
        };
    },
}));

function TestComponent() {
    useTransactionNotifications();

    return (
        <div>
        </div>
    )
}

describe('When use the transaction notifications hook', () => {
    it('it shows the user confirmation notification before the wait for transaction notification', () => {
        const { store } = renderWithProviders(
            <TestComponent />);

        expect(enqueueSnackbarMock).toHaveBeenCalledTimes(0);
        expect(closeSnackbarMock).toHaveBeenCalledTimes(1); // close will be called once initially on init

        act(() => {
            store.dispatch(start({ type: TrxType.BUNDLE_LOCK}));
            store.dispatch(waitingForUser({ active: true }));
        });
        
        expect(enqueueSnackbarMock).toHaveBeenCalledTimes(1);
        expect(closeSnackbarMock).toHaveBeenCalledTimes(1);

        act(() => {
            store.dispatch(waitingForTransaction({ active: true }));
        });
        
        expect(closeSnackbarMock).toHaveBeenCalledTimes(2);
        expect(enqueueSnackbarMock).toHaveBeenCalledTimes(2);
        
        act(() => {
            store.dispatch(finish());
        });

        expect(closeSnackbarMock).toHaveBeenCalledTimes(3);
        expect(enqueueSnackbarMock).toHaveBeenCalledTimes(2);
    })
})
