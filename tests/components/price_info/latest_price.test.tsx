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
    it('renders name, symbol price and timestamp', () => {
        render(
            <LatestPrice
                name="USD Coin"
                symbol='USDC'
                decimals={8}
                price='101401234'
                timestamp={1630000000}
                />
        );

        expect(screen.getByTestId("currency-info")).toHaveTextContent("USD Coin");
        expect(screen.getByTestId("currency-info")).toHaveTextContent("USDC");
        expect(screen.getByTestId("exchange-rate")).toHaveTextContent("1.0140");
        expect(screen.getByTestId("exchange-rate")).not.toHaveTextContent("1.01401234");
        expect(screen.getByTestId("exchange-rate")).toHaveTextContent("2021-08-26 17:46:40 UTC");
    })
})