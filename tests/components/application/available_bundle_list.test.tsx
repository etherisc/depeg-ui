import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BundleData } from '../../../src/backend/bundle_data';
import { AvailableBundleRow } from '../../../src/components/application/available_bundle_list';
import { BigNumber } from 'ethers';


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
    it('renders all relevant data', () => {
        const bundle = {
            id: 42,
            name: "some bundle",
            riskpoolId: 10,
            tokenId: 27,
            apr: 2.7,
            minSumInsured: 1100 * Math.pow(10, 6),
            maxSumInsured: 2100 * Math.pow(10, 6),
            minDuration: 30 * 86400,
            maxDuration: 60 * 86400,
            capacity: 20000 * Math.pow(10, 6),
            capitalSupport: BigNumber.from(23000 * Math.pow(10, 6)).toString(),
            locked: 0,
        } as BundleData;

        render(
            <table><tbody>
                <AvailableBundleRow
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    />
            </tbody></table>
        );

        expect(screen.getByTestId("bundle-id")).toHaveTextContent("42");
        expect(screen.getByTestId("bundle-name")).toHaveTextContent("some bundle");
        expect(screen.getByTestId("bundle-apr")).toHaveTextContent("2.7%");
        expect(screen.getByTestId("bundle-suminsured")).toHaveTextContent("USDC 1,100.00 / 2,100.00");
        expect(screen.getByTestId("bundle-duration")).toHaveTextContent("30 / 60 days");
        expect(screen.getByTestId("bundle-capacity")).toHaveTextContent("USDC 20,000.00");
        expect(screen.getByTestId("bundle-stakeusage")).toBeInTheDocument();
    })

    it('capacity takes locked and capitalSupport into account', () => {
        const bundle = {
            id: 42,
            name: "some bundle",
            riskpoolId: 10,
            tokenId: 27,
            apr: 2.7,
            minSumInsured: 1100 * Math.pow(10, 6),
            maxSumInsured: 2100 * Math.pow(10, 6),
            minDuration: 30 * 86400,
            maxDuration: 60 * 86400,
            capacity: 20000 * Math.pow(10, 6),
            capitalSupport: BigNumber.from(12000 * Math.pow(10, 6)).toString(),
            locked: 4000 * Math.pow(10, 6),
        } as BundleData;

        render(
            <table><tbody>
                <AvailableBundleRow
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    />
            </tbody></table>
        );

        expect(screen.getByTestId("bundle-capacity")).toHaveTextContent("USDC 8,000.00");
    })
})
