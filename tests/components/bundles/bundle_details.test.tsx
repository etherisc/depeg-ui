import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import StakeUsageIndicator from '../../../src/components/bundles/stake_usage_indicator';
import { parseUnits } from 'ethers/lib/utils';
import BundleDetails from '../../../src/components/bundles/bundle_details';
import { BundleData } from '../../../src/backend/bundle_data';
import dayjs from 'dayjs';
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

describe('When displaying the bundle detail component', () => {
    it('shows all important data correctly formatted', async () => {
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

        const baseDom = render(
            <BundleDetails
                bundle={bundle}
                currency="USDT"
                decimals={6}
                />
        );

        expect(screen.getByText('bundle_state_1')).toBeInTheDocument();
        expect(screen.getByText('USDT 100,123.00')).toBeInTheDocument(); // balance
        expect(screen.getByText('USDT 90,000.00')).toBeInTheDocument(); // capacity
        expect(screen.getByText('USDT 10,000.00')).toBeInTheDocument(); // locked
        expect(screen.getByText('USDT 80,000.00')).toBeInTheDocument(); // capital support
        expect(screen.getByText('USDT 70,000.00')).toBeInTheDocument(); // remaining capital support
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('1,123.00'); // min sum insured
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('10,456.00'); // max sum insured
        expect(screen.getByText('11 / 28 days')).toBeInTheDocument(); // min / max duration
        expect(screen.getByText('3.1415 %')).toBeInTheDocument(); // apr
        expect(screen.getByText('789')).toBeInTheDocument(); // policies
        expect(screen.getByText('0x2CeC…4729')).toBeInTheDocument(); // owner
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('2023-02-16 09:58 UTC'); // created at
        expect(screen.getByTestId("bundle-details")).toHaveTextContent('2023-03-16 09:58 UTC'); // valid until
    })
})