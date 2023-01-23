import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import StakeUsageIndicator from '../../../src/components/bundles/stake_usage_indicator';
import { parseUnits } from 'ethers/lib/utils';

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

describe('StakeUsageIndicator', () => {
    it('renders green when stakeUsage == 0.0', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={0.0}
                lockedCapital={parseUnits("0", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeInTheDocument();
        expect(screen.queryByTestId("indidactor-undefined")).toBeNull();
        expect(screen.queryByTestId("indidactor-warning")).toBeNull();
        expect(screen.queryByTestId("indidactor-error")).toBeNull();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-ok"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("0%");
    })

    it('renders green when stakeUsage == 0.1', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={0.1}
                lockedCapital={parseUnits("10000", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeInTheDocument();
        expect(screen.queryByTestId("indidactor-undefined")).toBeNull();
        expect(screen.queryByTestId("indidactor-warning")).toBeNull();
        expect(screen.queryByTestId("indidactor-error")).toBeNull();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-ok"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("10%");
        expect(screen.queryByTestId("locked-capital")).toHaveTextContent("USDC 10,000.0");
        expect(screen.queryByTestId("supported-capital")).toHaveTextContent("USDC 100,000.0");
    })

    it('renders orange when stakeUsage == 0.92', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={0.92}
                lockedCapital={parseUnits("92000", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeNull();
        expect(screen.queryByTestId("indidactor-undefined")).toBeNull();
        expect(screen.queryByTestId("indidactor-warning")).toBeInTheDocument();
        expect(screen.queryByTestId("indidactor-error")).toBeNull();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-warning"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("92%");
    })

    it('renders red when stakeUsage == 1.0', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={1.0}
                lockedCapital={parseUnits("100000", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeNull();
        expect(screen.queryByTestId("indidactor-undefined")).toBeNull();
        expect(screen.queryByTestId("indidactor-warning")).toBeNull();
        expect(screen.queryByTestId("indidactor-error")).toBeInTheDocument();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-error"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("100%");
    })

    it('renders grey when stakeUsage == undefined', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={undefined}
                lockedCapital={parseUnits("0", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeNull();
        expect(screen.queryByTestId("indidactor-undefined")).toBeInTheDocument();
        expect(screen.queryByTestId("indidactor-warning")).toBeNull();
        expect(screen.queryByTestId("indidactor-error")).toBeNull();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-undefined"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("no_stakes");
    })

    it('renders grey when stakeUsage < 0', async () => {
        const baseDom = render(
            <StakeUsageIndicator
                stakeUsage={-0.1}
                lockedCapital={parseUnits("0", 6)}
                supportedCapital={parseUnits("100000", 6)}
                supportedToken="USDC"
                supportedTokenDecimals={6}
                />
        );

        expect(screen.queryByTestId("indidactor-ok")).toBeNull();
        expect(screen.queryByTestId("indidactor-undefined")).toBeInTheDocument();
        expect(screen.queryByTestId("indidactor-warning")).toBeNull();
        expect(screen.queryByTestId("indidactor-error")).toBeNull();
        
        fireEvent.mouseOver(baseDom.getByTestId("indidactor-undefined"));

        expect(await screen.findByTestId("stake-usage")).toHaveTextContent("no_stakes");
    })
})