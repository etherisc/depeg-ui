import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BundleData } from '../../../src/backend/bundle_data';
import { AvailableBundleRow } from '../../../src/components/application/available_bundle_list';
import { BigNumber } from 'ethers';
import userEvent from '@testing-library/user-event';

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

describe('When rendering a bundle in the AvailableBundleList', () => {
    it('renders all relevant data', async () => {
        const user = userEvent.setup()

        const bundle = {
            id: 42,
            riskpoolId: 10,
            owner: "0x1234",
            tokenId: 27,
            apr: 2.7,
            minSumInsured: BigNumber.from(1100 * Math.pow(10, 6)).toString(),
            maxSumInsured: BigNumber.from(2100 * Math.pow(10, 6)).toString(),
            minDuration: 30 * 86400,
            maxDuration: 60 * 86400,
            capacity: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
            capitalSupport: BigNumber.from(23000 * Math.pow(10, 6)).toString(),
            locked: BigNumber.from(0).toString(),
            name: "some bundle",
        } as BundleData;

        let clicked = false;

        render(
            <table><tbody>
                <AvailableBundleRow
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    selected={false}
                    onBundleSelected={() => clicked = true}
                    />
            </tbody></table>
        );

        expect(screen.getByTestId("bundle-id")).toHaveTextContent("42");
        expect(screen.getByTestId("bundle-name")).toHaveTextContent("some bundle");
        expect(screen.getByTestId("bundle-apr")).toHaveTextContent("2.7%");
        expect(screen.getByTestId("bundle-suminsured")).toHaveTextContent("USDC 1,100.00 / 2,100.00");
        expect(screen.getByTestId("bundle-duration")).toHaveTextContent("30 / 60 days");
        expect(screen.getByTestId("bundle-capacity")).toHaveTextContent("USDC 20,000.00");

        await user.click(screen.getByTestId("bundle-name"));
        expect(clicked).toBe(true);
    })

    it('capacity takes locked and capitalSupport into account', () => {
        const bundle = {
            id: 42,
            name: "some bundle",
            riskpoolId: 10,
            tokenId: 27,
            apr: 2.7,
            minSumInsured: BigNumber.from(1100 * Math.pow(10, 6)).toString(),
            maxSumInsured: BigNumber.from(2100 * Math.pow(10, 6)).toString(),
            minDuration: 30 * 86400,
            maxDuration: 60 * 86400,
            capacity: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
            capitalSupport: BigNumber.from(12000 * Math.pow(10, 6)).toString(),
            locked: BigNumber.from(4000 * Math.pow(10, 6)).toString(),
        } as BundleData;

        render(
            <table><tbody>
                <AvailableBundleRow
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    selected={true}
                    onBundleSelected={() => {}}
                    />
            </tbody></table>
        );

        expect(screen.getByTestId("bundle-capacity")).toHaveTextContent("USDC 8,000.00");
        expect(screen.getByRole("row")).toHaveClass("Mui-selected");
    })

    it('selected attribute marks row as selected', () => {
        const bundle = {
            id: 42,
            name: "some bundle",
            riskpoolId: 10,
            tokenId: 27,
            apr: 2.7,
            minSumInsured: BigNumber.from(1100 * Math.pow(10, 6)).toString(),
            maxSumInsured: BigNumber.from(2100 * Math.pow(10, 6)).toString(),
            minDuration: 30 * 86400,
            maxDuration: 60 * 86400,
            capacity: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
            capitalSupport: BigNumber.from(12000 * Math.pow(10, 6)).toString(),
            locked: BigNumber.from(4000 * Math.pow(10, 6)).toString(),
        } as BundleData;

        render(
            <table><tbody>
                <AvailableBundleRow
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    selected={true}
                    onBundleSelected={() => {}}
                    />
            </tbody></table>
        );

        expect(screen.getByRole("row")).toHaveClass("Mui-selected");
    })
})
