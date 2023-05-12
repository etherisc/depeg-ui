import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { SnackbarProvider } from 'notistack';
import { BundleData } from '../../../src/backend/bundle_data';
import BundleDetails from '../../../src/components/show_bundle/bundle_details';
import dayjs from 'dayjs';

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

describe('When displaying the bundle detail component', () => {
    it('shows all important data correctly formatted', async () => {
        const createdAt = dayjs().add(-3, 'd').unix();
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
            locked: parseUnits("12000", 6).toString(),
            capitalSupport: parseUnits("8000", 6).toString(),
            supportedCapacity: parseUnits("80000", 6).toString(),
            supportedCapacityRemaining: parseUnits("68000", 6).toString(),
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: createdAt,
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <SnackbarProvider>
                <BundleDetails
                    bundle={bundle}
                    currency="USDT"
                    decimals={6}
                    currencyProtected="USDC"
                    decimalsProtected={6}
                    />
            </SnackbarProvider>
        );

        expect(screen.getByText('bundle_state_1')).toBeInTheDocument();
        expect(screen.getByText('USDT 100,123.00')).toBeInTheDocument(); // balance
        expect(screen.getByText('USDT 100,000.00')).toBeInTheDocument(); // capital
        expect(screen.getByText('USDT 8,000.00')).toBeInTheDocument(); // capital support
        expect(screen.getByText('USDT 12,000.00')).toBeInTheDocument(); // locked
        expect(screen.getByText('USDC 90,000.00')).toBeInTheDocument(); // capacity
        expect(screen.getByText('USDC 80,000.00')).toBeInTheDocument(); // supported capacity
        expect(screen.getByText('USDC 68,000.00')).toBeInTheDocument(); // remaining supported capacity
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('1,123.00'); // min sum insured
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('10,456.00'); // max sum insured
        expect(screen.getByText('11 / 28 days')).toBeInTheDocument(); // min / max duration
        expect(screen.getByText('3.1415 %')).toBeInTheDocument(); // apr
        expect(screen.getByText('789')).toBeInTheDocument(); // policies
        expect(screen.getByText('0x2CeC…4729')).toBeInTheDocument(); // owner
        const createdAtFormatted = dayjs.unix(createdAt).format('YYYY-MM-DD HH:mm UTC');
        expect(screen.getByTestId("bundle-details")).toHaveTextContent(createdAtFormatted); // created at
        const validUntilFormatted = dayjs.unix(createdAt + 28 * 24 * 60 * 60).format('YYYY-MM-DD HH:mm UTC');
        expect(screen.getByTestId("bundle-details")).toHaveTextContent(validUntilFormatted); // valid until
    })

    it('renders the effective capacity as 0 if < 0', async () => {
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
            locked: parseUnits("12000", 6).toString(),
            capitalSupport: parseUnits("1000", 6).toString(),
            supportedCapacity: parseUnits("10000", 6).toString(),
            supportedCapacityRemaining: parseUnits("0", 6).toString(),
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: 1676541508,
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <SnackbarProvider>
                <BundleDetails
                    bundle={bundle}
                    currency="USDT"
                    decimals={6}
                    currencyProtected="USDC"
                    decimalsProtected={6}
                    />
            </SnackbarProvider>
        );

        expect(screen.getByText('USDC 0.00')).toBeInTheDocument();
    })

    it('an expired bundle is shown with state expired', async () => {
        const createdAt = dayjs().add(-30, 'day');
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
            locked: parseUnits("12000", 6).toString(),
            capitalSupport: parseUnits("8000", 6).toString(),
            supportedCapacity: parseUnits("80000", 6).toString(),
            supportedCapacityRemaining: parseUnits("68000", 6).toString(),
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: createdAt.unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <SnackbarProvider>
                <BundleDetails
                    bundle={bundle}
                    currency="USDT"
                    decimals={6}
                    currencyProtected="USDC"
                    decimalsProtected={6}
                    />
            </SnackbarProvider>
        );

        expect(screen.getByText('bundle_state_expired')).toBeInTheDocument();
        const createdAtExpected = createdAt.format('YYYY-MM-DD HH:mm UTC');
        expect(screen.getByTestId("bundle-details")).toHaveTextContent(createdAtExpected); // created at
        const validUntilExpected = createdAt.add(28, 'day').format('YYYY-MM-DD HH:mm UTC');
        expect(screen.getByTestId("bundle-details")).toHaveTextContent(validUntilExpected); // valid until
    })
})