import { executeInTheNextEventLoopTick } from '@mui/x-date-pickers/internals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BundleData } from '../../../src/backend/bundle_data';
import BundleActions from '../../../src/components/show_bundle/bundle_actions';
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

describe('When displaying the bundle actions', () => {
    it('a bundle without owner shows no actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 0,
            policies: 0,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet="0xA3C552FA4756dd343394785283923bE2f27f8814"
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByRole("alert")).toHaveTextContent("alert.actions_only_owner");
        expect(screen.queryByTestId("button-fund")).toBeNull();
        expect(screen.queryByTestId("button-withdraw")).toBeNull();
        expect(screen.queryByTestId("button-extend")).toBeNull();
        expect(screen.queryByTestId("button-lock")).toBeNull();
        expect(screen.queryByTestId("button-unlock")).toBeNull();
        expect(screen.queryByTestId("button-close")).toBeNull();
        expect(screen.queryByTestId("button-burn")).toBeNull();
    });

    it('an active bundle without policies shows correct actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 0,
            policies: 0,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeEnabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeEnabled();
        expect(screen.getByTestId("button-lock")).toBeEnabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeEnabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })

    it('an active bundle with policies shows correct actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 0,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeEnabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeEnabled();
        expect(screen.getByTestId("button-lock")).toBeEnabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeDisabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })

    it('bundle extension is not allowed when remaining lifetime is more then 28 days (default)', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(40 * 24 * 60 * 60).toString(),    
            state: 0,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeEnabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeDisabled();
        expect(screen.getByTestId("button-lock")).toBeEnabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeDisabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })

    it('a locked bundle shows correct actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeEnabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeDisabled();
        expect(screen.getByTestId("button-lock")).toBeDisabled();
        expect(screen.getByTestId("button-unlock")).toBeEnabled();
        expect(screen.getByTestId("button-close")).toBeDisabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })

    it('a locked bundle and maxed out acive bundles shows correct actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 1,
            policies: 0,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={5}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeEnabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeDisabled();
        expect(screen.getByTestId("button-lock")).toBeDisabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeEnabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })

    it('a closed bundle shows correct actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 2,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );
        
        expect(screen.getByTestId("button-fund")).toBeDisabled();
        expect(screen.getByTestId("button-withdraw")).toBeEnabled();
        expect(screen.getByTestId("button-extend")).toBeDisabled();
        expect(screen.getByTestId("button-lock")).toBeDisabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeDisabled();
        expect(screen.getByTestId("button-burn")).toBeEnabled();
    })

    it('a burnt bundle shows disabled actions', async () => {
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
            minProtectedAmount: parseUnits("1123", 6).toString(),
            maxProtectedAmount: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: dayjs().subtract(2, 'days').unix(),
            lifetime: BigNumber.from(28 * 24 * 60 * 60).toString(),    
            state: 3,
            policies: 789,
        } as BundleData;

        const baseDom = render(
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    extend: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("button-fund")).toBeDisabled();
        expect(screen.getByTestId("button-withdraw")).toBeDisabled();
        expect(screen.getByTestId("button-extend")).toBeDisabled();
        expect(screen.getByTestId("button-lock")).toBeDisabled();
        expect(screen.getByTestId("button-unlock")).toBeDisabled();
        expect(screen.getByTestId("button-close")).toBeDisabled();
        expect(screen.getByTestId("button-burn")).toBeDisabled();
    })
})