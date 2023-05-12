import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { BundleData } from '../../../src/backend/bundle_data';
import BundlesListDesktop from '../../../src/components/bundles/bundles_list_desktop';
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

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('When rendering the bundles list', () => {
    it('name, state, apr, balance, capacity and open until are shown', async () => {
        const backendApi = mockSimple();
        const today = dayjs();
        const createdAt = today.add(-3, 'd').unix();
        const createdAtExp = today.add(-30, 'd').unix();
        const lifetimesec = 28 * 24 * 60 * 60;
        const bundles = [
            { // active bundle
                id: 42,
                riskpoolId: 13,
                owner: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
                tokenId: 7,
                name: "Happy Testing",
                apr: 3.1415,
                capital: parseUnits("2000", 6).toString(),
                balance: parseUnits("2013", 6).toString(),
                capacity: parseUnits("9000", 6).toString(),
                locked: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("20000", 6).toString(),
                supportedCapacity: parseUnits("10000", 6).toString(),
                supportedCapacityRemaining: parseUnits("8000", 6).toString(),
                minProtectedAmount: parseUnits("1234", 6).toString(),
                maxProtectedAmount: parseUnits("4567", 6).toString(),
                minDuration: 11 * 24 * 60 * 60,
                maxDuration: 28 * 24 * 60 * 60,
                createdAt: createdAt,
                lifetime: BigNumber.from(lifetimesec).toString(),    
                state: 1,
                policies: 7,
            } as BundleData,
            { // expired bundle
                id: 43,
                riskpoolId: 13,
                owner: "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729",
                tokenId: 7,
                name: "Expired bundle",
                apr: 3.1415,
                capital: parseUnits("2000", 6).toString(),
                balance: parseUnits("2013", 6).toString(),
                capacity: parseUnits("9000", 6).toString(),
                locked: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("20000", 6).toString(),
                supportedCapacity: parseUnits("10000", 6).toString(),
                supportedCapacityRemaining: parseUnits("8000", 6).toString(),
                minProtectedAmount: parseUnits("1234", 6).toString(),
                maxProtectedAmount: parseUnits("4567", 6).toString(),
                minDuration: 11 * 24 * 60 * 60,
                maxDuration: 28 * 24 * 60 * 60,
                createdAt: createdAtExp,
                lifetime: BigNumber.from(lifetimesec).toString(),    
                state: 1,
                policies: 7,
            } as BundleData,
        ];

        renderWithProviders(
            <BundlesListDesktop
                usd2="USDT"
                usd2Decimals={6}
                />
            ,
            {
                preloadedState: {
                    account: {
                        address: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
                        balance: {
                            amount: parseEther("1.1").toString(),
                            currency: 'ETH',
                            decimals: 18,
                        },
                        balanceUsd1: {
                            amount: parseUnits("11000").toString(),
                            currency: 'USDC',
                            decimals: 6,
                        },
                        balanceUsd2: {
                            amount: parseUnits("12000").toString(),
                            currency: 'USDT',
                            decimals: 6,
                        },
                    },
                    bundles: {
                        bundles: bundles,
                        maxActiveBundles: 10,
                        isLoadingBundles: false,
                        showBundle: undefined,
                        showCreationConfirmation: false,
                        isShowBundleFund: false,
                        isShowBundleWithdraw: false,
                    }
                },
            }
        );

        await waitFor(async () => 
            expect(await screen.findAllByRole("row")).toHaveLength(3)
        );
        
        const rows = await screen.findAllByRole("row");

        expect(rows[1]).toHaveTextContent("42");
        expect(rows[1]).toHaveTextContent("Happy Testing");
        expect(rows[1]).toHaveTextContent("bundle_state_1"); // active
        expect(rows[1]).toHaveTextContent("3.14%");
        expect(rows[1]).toHaveTextContent("USDT 2,013.00");
        expect(rows[1]).toHaveTextContent("USDT 9,000.00");
        const openUntilDate = dayjs.unix(createdAt + lifetimesec).format('YYYY-MM-DD');
        expect(rows[1]).toHaveTextContent(openUntilDate);

        expect(rows[2]).toHaveTextContent("43");
        expect(rows[2]).toHaveTextContent("Expired bundle");
        expect(rows[2]).toHaveTextContent("bundle_state_expired"); // expired
        const openUntilDateExp = dayjs.unix(createdAtExp + lifetimesec).format('YYYY-MM-DD');
        expect(rows[2]).toHaveTextContent(openUntilDateExp);
    })
});
