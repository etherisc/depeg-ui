import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BundleData } from '../../../src/backend/bundle_data';
import { AvailableBundleList, AvailableBundleRow } from '../../../src/components/application/available_bundle_list';
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

const bundle1 = {
    id: 42,
    riskpoolId: 10,
    owner: "0x1234",
    tokenId: 27,
    apr: 3.1,
    minSumInsured: BigNumber.from(1100 * Math.pow(10, 6)).toString(),
    maxSumInsured: BigNumber.from(2100 * Math.pow(10, 6)).toString(),
    minDuration: 30 * 86400,
    maxDuration: 60 * 86400,
    capacity: BigNumber.from(20000 * Math.pow(10, 6)).toString(),
    capitalSupport: BigNumber.from(23000 * Math.pow(10, 6)).toString(),
    locked: BigNumber.from(0).toString(),
    name: "bundle1",
} as BundleData;
const bundle2 = {
    id: 43,
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
    name: "bundle2",
} as BundleData;

describe('When rendering the AvailableBundleList', () => {
    it('with no bundles an error for no capacity is riskpool is shown', () => {
        render(
            <AvailableBundleList
                formDisabled={false}
                isWalletConnected={true}
                bundles={[]}
                bundlesLoading={false}
                applicableBundleIds={undefined}
                selectedBundleId={undefined}
                currency="USDC"
                currencyDecimals={6}
                onBundleSelected={() => {}}
                />
            
        );

        expect(screen.getByRole("alert")).toHaveTextContent("alert.riskpool_capacity_exceeded");
    })

    it('with bundles and no match and a warning for no matching bundle is shown', () => {
        render(
            <AvailableBundleList
                formDisabled={false}
                isWalletConnected={true}
                bundles={[
                    bundle1
                ]}
                bundlesLoading={false}
                applicableBundleIds={[]}
                selectedBundleId={undefined}
                currency="USDC"
                currencyDecimals={6}
                onBundleSelected={() => {}}
                /> 
        );

        expect(screen.getByRole("alert")).toHaveTextContent("alert.no_matching_bundle");
    })

    it('with two bundles, then two bundles are shown in table', () => {
        render(
            <AvailableBundleList
                formDisabled={false}
                isWalletConnected={true}
                bundles={[
                    bundle1, bundle2
                ]}
                bundlesLoading={false}
                applicableBundleIds={undefined}
                selectedBundleId={undefined}
                currency="USDC"
                currencyDecimals={6}
                onBundleSelected={() => {}}
                /> 
        );

        expect(screen.getByRole("table")).toHaveTextContent("bundle1");
        expect(screen.getByRole("table")).toHaveTextContent("bundle2");

        // ensure sortered by apr ascending
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("2.7%");
        expect(screen.getAllByRole("row")[2]).toHaveTextContent("3.1%");
    })

    it('with two bundles and one filtered, then only one bundle is shown in table', () => {
        render(
            <AvailableBundleList
                formDisabled={false}
                isWalletConnected={true}
                bundles={[
                    bundle1, bundle2
                ]}
                bundlesLoading={false}
                applicableBundleIds={[bundle2.id]}
                selectedBundleId={undefined}
                currency="USDC"
                currencyDecimals={6}
                onBundleSelected={() => {}}
                /> 
        );

        expect(screen.getByRole("table")).not.toHaveTextContent("bundle1");
        expect(screen.getByRole("table")).toHaveTextContent("bundle2");
    })

});

describe('When rendering a bundle in the AvailableBundleRow', () => {
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
                    formDisabled={false}
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

    it('clicking does not work when form is disabled', async () => {
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
                    formDisabled={true}
                    bundle={bundle}
                    currency="USDC"
                    currencyDecimals={6}
                    selected={false}
                    onBundleSelected={() => clicked = true}
                    />
            </tbody></table>
        );
        await user.click(screen.getByTestId("bundle-name"));
        expect(clicked).toBe(false);
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
                    formDisabled={false}
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
                    formDisabled={false}
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
