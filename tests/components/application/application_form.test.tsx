import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import ApplicationForm from '../../../src/components/application/application_form';
import { mockSimple } from '../../mocks/backend_api/backend_api_mock';
import { renderWithProviders } from '../../util/render_with_provider';
import { BundleData } from '../../../src/backend/bundle_data';
import { ComponentState } from '../../../src/types/component_state';

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

describe('ApplicationForm', () => {
    it('checks the insured wallet during entry', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                hasBalance={async () => true}
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

    it('checks the protected amount during entry', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                hasBalance={async () => true}
                premiumTrxTextKey={undefined}
                readyToSubmit={(isFormReady: boolean) => {}}
                applyForPolicy={(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => {}}
                />
        );

        const insuredAmountInput = screen.getByTestId("protected-amount").querySelector("input");
        expect(insuredAmountInput).toHaveAttribute("value", "");

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "100" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.min");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "10000" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.required");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "abc" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000.0" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000,0" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.amountType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("protected-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("protected_amount_helper");
        });
    })

    it('checks the protection duration during entry', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                hasBalance={async () => true}
                premiumTrxTextKey={undefined}
                readyToSubmit={(isFormReady: boolean) => {}}
                applyForPolicy={(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => {}}
                />
        );

        const insuredAmountInput = screen.getByTestId("coverageDuration").querySelector("input");
        expect(insuredAmountInput).toHaveAttribute("value", "45");

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "3" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("coverageDuration");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.min");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "100" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("coverageDuration");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("coverageDuration");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.required");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "abc" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("coverageDuration");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.numberType");
        });

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "30" } });
        });
        await waitFor(async () => {
            const ia = await screen.findByTestId("coverageDuration");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toBeNull();
        });
    })

    it('calculates the premium and checks wallet balance when the insured amount is entered', async () => {
        const backendApi = mockSimple();
        const bundle1 = {
            id: 42,
            riskpoolId: 10,
            owner: "0x1234",
            tokenId: 27,
            apr: 5,
            minProtectedAmount: BigNumber.from(1000 * Math.pow(10, 6)).toString(),
            maxProtectedAmount: BigNumber.from(2000 * Math.pow(10, 6)).toString(),
            minDuration: 30 * 86400,
            maxDuration: 40 * 86400,
            capacity: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
            supportedCapacityRemaining: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
            capitalSupport: BigNumber.from(23000 * Math.pow(10, 6)).toString(),
            locked: BigNumber.from(0).toString(),
            name: "bundle1",
        } as BundleData;

        let hasBalance = false;

        renderWithProviders(
            <ApplicationForm
                formDisabled={false}
                connectedWalletAddress="0x123456789012345678901234567890123456789012"
                usd1="USDC"
                usd1Decimals={6}
                usd2="USDT"
                usd2Decimals={6}
                applicationApi={backendApi.application}
                hasBalance={async () => hasBalance}
                premiumTrxTextKey={undefined}
                readyToSubmit={(isFormReady: boolean) => {}}
                applyForPolicy={(walletAddress: string, insuredAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) => {}}
                />,
            {
                preloadedState: {
                    application: {
                        productComponentState: ComponentState.Active,
                        isLoadingBundles: false,
                        bundles: [ bundle1 ],
                        exampleRate: "0.9",
                        applicableBundleIds: undefined,
                        selectedBundleId: undefined,
                        premium: undefined,
                        premiumErrorKey: undefined,
                        premiumCalculationInProgress: false,
                        claimGracePeriod: 30,
                    },
                },
            }
        );

        const insuredAmountInput = screen.getByTestId("protected-amount").querySelector("input");

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000" } });
            fireEvent.focusOut(insuredAmountInput!);
        });

        await waitFor(async () => {
            const premium = await screen.findByTestId("premium-amount");
            console.log(premium.nodeValue);
            return expect(premium.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error_wallet_balance_too_low");
        });

        // now simulate a correct balance
        hasBalance = true;

        act(() => {
            fireEvent.change(insuredAmountInput!, { target: { value: "1000" } });
            fireEvent.focusOut(insuredAmountInput!);
        });

        await waitFor(async () => {
            const premium = await screen.findByTestId("premium-amount");
            console.log(premium.nodeValue);
            return expect(premium.querySelector("input")?.value).toBe("100.00");
        });
    })

})
