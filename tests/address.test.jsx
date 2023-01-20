import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Address from "../src/components/address";
import { SnackbarProvider } from 'notistack';

const MYADDRESS = "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: key => key }),
}));

describe('Address', () => {
    it('renders shortened address', () => {
        render(
            <SnackbarProvider>
                <Address 
                    address={MYADDRESS}
                    />)
            </SnackbarProvider>
        );

        expect(screen.getByText(/0x2CeC…4729/)).toBeInTheDocument();
    })
})
