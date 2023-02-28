import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import ApplicationForm from '../../../src/components/application/application_form';
import InvestForm from '../../../src/components/invest/invest_form';
import { mockSimple } from '../../mocks/backend_api/backend_api_mock';
import { renderWithProviders } from '../../util/render_with_provider';

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


})
