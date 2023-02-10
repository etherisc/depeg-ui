import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BigNumber } from 'ethers';
import ApplicationForm from '../../../src/components/application/application_form';
import { mockSimple } from '../../mocks/backend_api/backend_api_mock';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { renderWithProviders } from '../../util/render_with_provider';
import userEvent from '@testing-library/user-event';
import { delay } from '../../../src/utils/delay';

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

describe('When rendering the ApplicationForm', () => {
    it('the insured wallet is checked', async () => {
        const backendApi = mockSimple((message: SnackbarMessage, options?: OptionsObject) => { return {} as SnackbarKey});
        
        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                insuranceApi={backendApi}
                premiumTrxTextKey={undefined}
                readyToSubmit={(isFormReady: boolean) => {}}
                applyForPolicy={(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => {}}
                />
        );

        const insuredAmountInput = screen.getByTestId("insuredWallet").querySelector("input");
        expect(insuredAmountInput).toHaveAttribute("value", "0x123456789012345678901234567890123456789012");

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb472" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredWallet");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.minLength");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb472AB" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredWallet");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.maxLength");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb472Y" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredWallet");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.walletType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb472A" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredWallet");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.isAddress");
        });

    })

    it('the protected amount is checked', async () => {
        const backendApi = mockSimple((message: SnackbarMessage, options?: OptionsObject) => { return {} as SnackbarKey});
        
        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                insuranceApi={backendApi}
                premiumTrxTextKey={undefined}
                readyToSubmit={(isFormReady: boolean) => {}}
                applyForPolicy={(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => {}}
                />
        );

        const insuredAmountInput = screen.getByTestId("insuredAmount").querySelector("input");
        expect(insuredAmountInput).toHaveAttribute("value", "");

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "100" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.min");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "10000" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.required");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "abc" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000.0" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000,0" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("insuredAmount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toBeNull();
        });
    })

})
