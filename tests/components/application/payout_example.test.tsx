import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import ApplicationForm from '../../../src/components/application/application_form';
import PayoutExample from '../../../src/components/application/payout_example';
import { mockSimple } from '../../mocks/backend_api/backend_api_mock';
import { renderWithProviders } from '../../util/render_with_provider';
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

describe('When rendering the PayoutExample', () => {
    it('the correct amounts and thresholds are shown', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <PayoutExample
                protectedAmount={undefined}
                currency="USDC"
                currency2="USDT"
                />,
            {
                preloadedState: {
                    application: {
                        productComponentState: ComponentState.Active,
                        bundles: [],
                        isLoadingBundles: false,
                        exampleRate: "0.9",
                        claimGracePeriod: 7 * 24 * 3600,
                        applicableBundleIds: undefined,
                        selectedBundleId: undefined,
                        premium: undefined,
                        premiumErrorKey: undefined,
                        premiumCalculationInProgress: false,
                    }
                }
            }
        );

        expect(screen.getByTestId('text1')).toHaveTextContent("0.995");
        expect(screen.getByTestId('text1')).toHaveTextContent("0.999");
        expect(screen.getByTestId('text1')).toHaveTextContent("24");
        expect(screen.getByTestId('text2')).toHaveTextContent("0.995");
        expect(screen.getByTestId('text2')).toHaveTextContent("0.999");
        expect(screen.getByTestId('text2')).toHaveTextContent("24");
        expect(screen.getByTestId('text2')).toHaveTextContent("0.8");
        expect(screen.getByTestId('text2')).toHaveTextContent("20");
        expect(screen.getByTestId('text2')).toHaveTextContent("7");
        expect(screen.getByTestId('text3')).toHaveTextContent("0.9");
        expect(screen.getByTestId('text3')).toHaveTextContent("1,000.00");
        expect(screen.getByTestId('text3')).toHaveTextContent("100.00");
        expect(screen.getByTestId('text3')).toHaveTextContent("200.00"); // max payout
    })

    it('with given amount the correct amounts and thresholds are shown', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <PayoutExample
                protectedAmount="20000"
                currency="USDC"
                currency2="USDT"
                />,
            {
                preloadedState: {
                    application: {
                        productComponentState: ComponentState.Active,
                        bundles: [],
                        isLoadingBundles: false,
                        exampleRate: "0.6",
                        claimGracePeriod: 7 * 24 * 3600,
                        applicableBundleIds: undefined,
                        selectedBundleId: undefined,
                        premium: undefined,
                        premiumErrorKey: undefined,
                        premiumCalculationInProgress: false,
                    }
                }
            }
        );

        expect(screen.getByTestId('text1')).toHaveTextContent("0.995");
        expect(screen.getByTestId('text1')).toHaveTextContent("0.999");
        expect(screen.getByTestId('text3')).toHaveTextContent("0.6");
        expect(screen.getByTestId('text3')).toHaveTextContent("20,000.00");
        expect(screen.getByTestId('text3')).toHaveTextContent("8,000.00");
    })
})