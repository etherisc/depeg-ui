import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BundleData } from '../../../src/backend/bundle_data';
import BundleFundForm from '../../../src/components/show_bundle/bundle_fund_form';
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

describe('When rendering the BundleFundForm', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules() // Most important - it clears the cache
      process.env = { ...OLD_ENV }; // Make a copy
    });

    afterAll(() => {
      process.env = OLD_ENV; // Restore old environment
    });

    it('the input amount is checked', async () => {
        const bundle = {
            id: 42,
            riskpoolId: 13,
            owner: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
            tokenId: 7,
            name: "Happy Testing",
            apr: 3.1415,
            capital: parseUnits("100000", 6).toString(),
            balance: parseUnits("100123", 6).toString(),
            capacity: parseUnits("90000", 6).toString(),
            locked: parseUnits("10000", 6).toString(),
            capitalSupport: parseUnits("80000", 6).toString(),
            minSumInsured: parseUnits("1123", 6).toString(),
            maxSumInsured: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: 1676541508,
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const fundMock = jest.fn();
        
        renderWithProviders(
            <BundleFundForm
                bundle={bundle}
                currency="USDT"
                decimals={6}
                maxInvestedAmount={BigNumber.from("100000")}
                getBundleCapitalCap={async () => parseUnits("100000", 6)}
                getRemainingRiskpoolCapacity={async () => 100000}
                doFund={fundMock}
                doCancel={async () => true}
                />
        );

        const amountInput = screen.getByTestId("amount").querySelector("input");
        expect(amountInput).toHaveAttribute("value", "0");

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "1000000" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "10000" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toBeNull();
        });

        const fundButton = screen.getByTestId("fund-button");
        expect(fundButton).toBeDisabled();

        const tCCheckbox = screen.getByTestId("t-and-c");
        
        // check t&c
        act(() => {
            fireEvent.click(tCCheckbox);
        });
        await waitFor(async () => {
            expect(fundButton).toBeEnabled();
        });

        // uncheck t&c
        act(() => {
            fireEvent.click(tCCheckbox);
        });
        await waitFor(async () => {
            expect(fundButton).toBeDisabled();
        });

        // check t&c
        act(() => {
            fireEvent.click(tCCheckbox);
        });
        await waitFor(async () => {
            expect(fundButton).toBeEnabled();
        });


        act(() => {
            fireEvent.click(fundButton);
        } );
        await waitFor(async () => {
            expect(fundMock).toBeCalledTimes(1);
            expect(fundMock).toBeCalledWith(bundle.id, parseUnits("10000", 6));
        });
    })

    it('the bundle capital capacity is considered', async () => {
        const bundle = {
            id: 42,
            riskpoolId: 13,
            owner: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
            tokenId: 7,
            name: "Happy Testing",
            apr: 3.1415,
            capital: parseUnits("100000", 6).toString(),
            balance: parseUnits("100123", 6).toString(),
            capacity: parseUnits("90000", 6).toString(),
            locked: parseUnits("10000", 6).toString(),
            capitalSupport: parseUnits("80000", 6).toString(),
            minSumInsured: parseUnits("1123", 6).toString(),
            maxSumInsured: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: 1676541508,
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const fundMock = jest.fn();
        
        renderWithProviders(
            <BundleFundForm
                bundle={bundle}
                currency="USDT"
                decimals={6}
                maxInvestedAmount={BigNumber.from("100000")}
                getRemainingRiskpoolCapacity={async () => 50000}
                getBundleCapitalCap={async () => parseUnits("10000", 6)}
                doFund={fundMock}
                doCancel={async () => true}
                />
            ,
            {
                preloadedState: {
                    chain: {
                        chainId: "0x0",
                        isConnected: true,
                        isExpectedChain: true,
                        provider: undefined,
                        signer: undefined,
                        blockNumber: 0,
                        blockTime: 0,
                    }
                }
            }
        );

        const amountInput = screen.getByTestId("amount").querySelector("input");

        await waitFor(async () => {
            expect(amountInput).toHaveAttribute("value", "0");
        });

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "10001" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

    })

    it('the bundle capital capacity as well as the remaining riskpool capacity is considered', async () => {
        const bundle = {
            id: 42,
            riskpoolId: 13,
            owner: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
            tokenId: 7,
            name: "Happy Testing",
            apr: 3.1415,
            capital: parseUnits("100000", 6).toString(),
            balance: parseUnits("100123", 6).toString(),
            capacity: parseUnits("90000", 6).toString(),
            locked: parseUnits("10000", 6).toString(),
            capitalSupport: parseUnits("80000", 6).toString(),
            minSumInsured: parseUnits("1123", 6).toString(),
            maxSumInsured: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: 1676541508,
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const fundMock = jest.fn();
        
        renderWithProviders(
            <BundleFundForm
                bundle={bundle}
                currency="USDT"
                decimals={6}
                maxInvestedAmount={BigNumber.from("100000")}
                getRemainingRiskpoolCapacity={async () => 5000}
                getBundleCapitalCap={async () => parseUnits("10000", 6)}
                doFund={fundMock}
                doCancel={async () => true}
                />
            ,
            {
                preloadedState: {
                    chain: {
                        chainId: "0x0",
                        isConnected: true,
                        isExpectedChain: true,
                        provider: undefined,
                        signer: undefined,
                        blockNumber: 0,
                        blockTime: 0,
                    }
                }
            }
        );

        const amountInput = screen.getByTestId("amount").querySelector("input");

        await waitFor(async () => {
            expect(amountInput).toHaveAttribute("value", "0");
        });

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "5001" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

    })
});