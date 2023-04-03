import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import ApplicationForm from '../../../src/components/application/application_form';
import InvestForm from '../../../src/components/invest/invest_form';
import { mockSimple, mockSimpleRemainingRiskpoolCapSmallerThanBundleCap } from '../../mocks/backend_api/backend_api_mock';
import { renderWithProviders } from '../../util/render_with_provider';
import { BundleData } from '../../../src/backend/bundle_data';

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

describe('When rendering the InvestForm', () => {
    it('the name is trimmed, checked for length, characters and uniqueness', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <InvestForm
                formDisabled={false}
                usd2="USDT"
                usd2Decimals={6}
                backend={backendApi}
                readyToSubmit={(isFormReady: boolean) => jest.fn()}
                invest={(
                    name: string, lifetime: number, 
                    investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
                    minDuration: number, maxDuration: number, annualPctReturn: number
                ) => jest.fn() }
                />,
        {
            preloadedState: {
                chain: {
                    chainId: "1",
                    isConnected: true,
                    isExpectedChain: true,
                    provider: undefined,
                    signer: undefined,
                    blockNumber: 1234,
                    blockTime: 42
                },
                bundles: {
                    bundles: [
                        { name: "abcdefgh" } as BundleData,
                    ],
                    maxActiveBundles: 10,
                    isLoadingBundles: false,
                    showBundle: undefined,
                    showCreationConfirmation: false,
                    isShowBundleFund: false,
                    isShowBundleWithdraw: false,
                }
            }
        });

        const bundleName = screen.getByTestId("bundle-name").querySelector("input");

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " " } });
            fireEvent.change(bundleName!, { target: { value: "" } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.required");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " " } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.minLength");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " aa" } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.minLength");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " abcdefghabcdefghabcdefghabcdefghabcdefghabcdefgh  " } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.maxLength");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: "abcdefghabcdefghabcdefghabcdefghabcdefghabcdefgh" } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.maxLength");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " abcdefgh., " } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.name.pattern");
        });

        act(() => {
            fireEvent.change(bundleName!, { target: { value: " abcdefgh " } });
        });

        await waitFor(async () => {
            console.log(bundleName?.value);
            const e = await screen.findByTestId("bundle-name");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.unique");
        });
    });


    it('the apr is checked', async () => {
        const backendApi = mockSimple();
        
        renderWithProviders(
            <InvestForm
                formDisabled={false}
                usd2="USDT"
                usd2Decimals={6}
                backend={backendApi}
                readyToSubmit={(isFormReady: boolean) => jest.fn()}
                invest={(
                    name: string, lifetime: number, 
                    investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
                    minDuration: number, maxDuration: number, annualPctReturn: number
                ) => jest.fn() }
                />
        );

        const aprInput = screen.getByTestId("annual-pct-return").querySelector("input");
        expect(aprInput).toHaveAttribute("value", "5");

        act(() => {
            fireEvent.change(aprInput!, { target: { value: "" } });
        });

        await waitFor(async () => {
            const ia = await screen.findByTestId("annual-pct-return");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.required");
        });

        act(() => {
            fireEvent.change(aprInput!, { target: { value: "0.777889" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("annual-pct-return");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.numberTypeFloatTwoDec");
        });

        act(() => {
            fireEvent.change(aprInput!, { target: { value: "20.0" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("annual-pct-return");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(aprInput!, { target: { value: "0" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("annual-pct-return");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.min");
        });

        act(() => {
            fireEvent.change(aprInput!, { target: { value: "3.14" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("annual-pct-return");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toBeNull();
        });

    })

    it('the max protected amount is limited to the bundle capacity', async () => {
        const backendApi = mockSimple();
        // remaining capacity is 25000 USDT
        // bundle cap is 2500 USDT
        
        renderWithProviders(
            <InvestForm
                formDisabled={false}
                usd2="USDT"
                usd2Decimals={6}
                backend={backendApi}
                readyToSubmit={(isFormReady: boolean) => jest.fn()}
                invest={(
                    name: string, lifetime: number, 
                    investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
                    minDuration: number, maxDuration: number, annualPctReturn: number
                ) => jest.fn() }
                />,
        {
            preloadedState: {
                chain: {
                    chainId: "1",
                    isConnected: true,
                    isExpectedChain: true,
                    provider: undefined,
                    signer: undefined,
                    blockNumber: 1234,
                    blockTime: 42
                }
            }
        }
                
        );

        const maxSumInsured = screen.getByTestId("max-sum-insured").querySelector("input");

        await waitFor(async () => {
            console.log(maxSumInsured?.value);
            expect(maxSumInsured).toHaveAttribute("value", "12500");
        });
    })

    it('the invested amount is limited to the bundle capacity', async () => {
        const backendApi = mockSimple();
        // remaining capacity is 25000 USDT
        // bundle cap is 2500 USDT
        
        renderWithProviders(
            <InvestForm
                formDisabled={false}
                usd2="USDT"
                usd2Decimals={6}
                backend={backendApi}
                readyToSubmit={(isFormReady: boolean) => jest.fn()}
                invest={(
                    name: string, lifetime: number, 
                    investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
                    minDuration: number, maxDuration: number, annualPctReturn: number
                ) => jest.fn() }
                />,
        {
            preloadedState: {
                chain: {
                    chainId: "1",
                    isConnected: true,
                    isExpectedChain: true,
                    provider: undefined,
                    signer: undefined,
                    blockNumber: 1234,
                    blockTime: 42
                }
            }
        });

        const investedAmount = screen.getByTestId("invested-amount").querySelector("input");

        await waitFor(async () => {
            console.log(investedAmount?.value);
            expect(investedAmount).toHaveAttribute("value", "2500");
        });

        // value is too high
        act(() => {
            fireEvent.change(investedAmount!, { target: { value: "10000" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("invested-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });
    })

    it('the invested amount is limited to the remaining riskpool capacity if its smaller than the bundle capacity', async () => {
        const backendApi = mockSimpleRemainingRiskpoolCapSmallerThanBundleCap();
        // remaining capacity is 1000 USDT
        // bundle cap is 2500 USDT
        
        renderWithProviders(
            <InvestForm
                formDisabled={false}
                usd2="USDT"
                usd2Decimals={6}
                backend={backendApi}
                readyToSubmit={(isFormReady: boolean) => jest.fn()}
                invest={(
                    name: string, lifetime: number, 
                    investedAmount: BigNumber, minSumInsured: BigNumber, maxSumInsured: BigNumber, 
                    minDuration: number, maxDuration: number, annualPctReturn: number
                ) => jest.fn() }
                />,
        {
            preloadedState: {
                chain: {
                    chainId: "1",
                    isConnected: true,
                    isExpectedChain: true,
                    provider: undefined,
                    signer: undefined,
                    blockNumber: 1234,
                    blockTime: 42
                }
            }
        });

        const investedAmount = screen.getByTestId("invested-amount").querySelector("input");

        await waitFor(async () => {
            console.log(investedAmount?.value);
            expect(investedAmount).toHaveAttribute("value", "1000");
        });

        // value is too high
        act(() => {
            fireEvent.change(investedAmount!, { target: { value: "10000" } });
        });
        
        await waitFor(async () => {
            const ia = await screen.findByTestId("invested-amount");
            return expect(ia.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });
    })

})
