import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BundleData } from '../../../src/backend/bundle_data';
import BundleActions from '../../../src/components/show_bundle/bundle_actions';

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
    it('an active bundle shows correct actions', async () => {
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
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.fund');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.withdraw');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.lock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.unlock');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.close');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.burn');
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
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={10}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.fund');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.withdraw');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.lock');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.unlock');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.close');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.burn');
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
            <BundleActions
                bundle={bundle}
                connectedWallet={bundle.owner}
                maxActiveBundles={5}
                activeBundles={5}
                actions={{ 
                    fund: jest.fn(),
                    withdraw: jest.fn(),
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.fund');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.withdraw');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.lock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.unlock');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.close');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.burn');
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
            minSumInsured: parseUnits("1123", 6).toString(),
            maxSumInsured: parseUnits("10456", 6).toString(),
            minDuration: 11 * 24 * 60 * 60,
            maxDuration: 28 * 24 * 60 * 60,
            createdAt: 1676541508,
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
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.fund');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.withdraw');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.lock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.unlock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.close');
        expect(screen.getByTestId("bundle-actions")).toHaveTextContent('action.burn');
    })

    it('a burnt bundle shows no actions', async () => {
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
                    lock: jest.fn(),
                    unlock: jest.fn(),
                    close: jest.fn(),
                    burn: jest.fn(),
                }}
                />
        );

        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.fund');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.withdraw');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.lock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.unlock');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.close');
        expect(screen.getByTestId("bundle-actions")).not.toHaveTextContent('action.burn');
    })
})