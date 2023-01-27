import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LatestPrice from '../../../src/components/price_info/latest_price';


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

describe('Latest price', () => {
    it('renders name, symbol price and timestamp for stable price', () => {
        render(
            <LatestPrice
                name="USD Coin"
                symbol='USDC'
                decimals={8}
                price='101401234'
                timestamp={1630000000}
                triggeredAt={0}
                depeggedAt={0}
                />
        );

        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USD Coin");
        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USDC");
        expect(screen.queryByTestId("price")).toHaveTextContent("1.0140");
        expect(screen.queryByTestId("price")).not.toHaveTextContent("1.01401234");
        expect(screen.queryByTestId("stability")).toHaveTextContent("state.stable");
        expect(screen.queryByTestId("timestamp")).toHaveTextContent("2021-08-26 17:46:40 UTC");
        expect(screen.queryByTestId("timestamp-triggered")).toBeNull();
        expect(screen.queryByTestId("timestamp-depegged")).toBeNull();
    })

    it('renders name, symbol price, timestamp and triggered timestamp for triggered price', () => {
        render(
            <LatestPrice
                name="USD Coin"
                symbol='USDC'
                decimals={8}
                price='101401234'
                timestamp={1630000000}
                triggeredAt={1620000000}
                depeggedAt={0}
                />
        );

        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USD Coin");
        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USDC");
        expect(screen.queryByTestId("price")).toHaveTextContent("1.0140");
        expect(screen.queryByTestId("price")).not.toHaveTextContent("1.01401234");
        expect(screen.queryByTestId("stability")).toHaveTextContent("state.triggered");
        expect(screen.queryByTestId("timestamp")).toHaveTextContent("2021-08-26 17:46:40 UTC");
        expect(screen.queryByTestId("timestamp-triggered")).toHaveTextContent("2021-05-03 00:00:00 UTC");
        expect(screen.queryByTestId("timestamp-depegged")).toBeNull();
    })

    it('renders name, symbol price, timestamp and depegged timestamp for depegged price', () => {
        render(
            <LatestPrice
                name="USD Coin"
                symbol='USDC'
                decimals={8}
                price='101401234'
                timestamp={1630000000}
                triggeredAt={1620000000}
                depeggedAt={1620500000}
                />
        );

        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USD Coin");
        expect(screen.queryByTestId("currency-info")).toHaveTextContent("USDC");
        expect(screen.queryByTestId("price")).toHaveTextContent("1.0140");
        expect(screen.queryByTestId("price")).not.toHaveTextContent("1.01401234");
        expect(screen.queryByTestId("stability")).toHaveTextContent("state.depegged");
        expect(screen.queryByTestId("timestamp")).toHaveTextContent("2021-08-26 17:46:40 UTC");
        expect(screen.queryByTestId("timestamp-triggered")).toBeNull();
        expect(screen.queryByTestId("timestamp-depegged")).toHaveTextContent("2021-05-08 18:53:20 UTC");
    })
})