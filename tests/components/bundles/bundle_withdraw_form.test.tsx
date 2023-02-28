import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BundleData } from '../../../src/backend/bundle_data';
import BundleFundForm from '../../../src/components/bundles/bundle_fund_form';
import BundleWithdrawForm from '../../../src/components/bundles/bundle_withdraw_form';
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

describe('When rendering the BundleWithdrawForm', () => {
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
            locked: parseUnits("40000", 6).toString(),
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

        const withdrawMock = jest.fn();
        
        renderWithProviders(
            <BundleWithdrawForm
                bundle={bundle}
                currency="USDT"
                decimals={6}
                doWithdraw={withdrawMock}
                doCancel={async () => true}
                />
        );

        const amountInput = screen.getByTestId("amount").querySelector("input");
        expect(amountInput).toHaveAttribute("value", "0");

        const fundButton = screen.getByTestId("withdraw-button");
        expect(fundButton).toBeDisabled();

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "1000000" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "70000" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toHaveTextContent("error.field.max");
        });

        act(() => {
            fireEvent.change(amountInput!, { target: { value: "60000" } });
        });
        await waitFor(async () => {
            const e = await screen.findByTestId("amount");
            return expect(e.querySelector("p.MuiFormHelperText-root")).toBeNull();
        });


        act(() => {
            fireEvent.click(fundButton);
        } );
        await waitFor(async () => {
            expect(withdrawMock).toBeCalledTimes(1);
            expect(withdrawMock).toBeCalledWith(bundle.id, parseUnits("60000", 6));
        });
    })

});