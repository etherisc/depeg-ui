import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Address from "../../src/components/address";
import { SnackbarProvider } from 'notistack';
import userEvent from '@testing-library/user-event';

const MYADDRESS = "0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729";

Object.assign(navigator, {
    clipboard: {
        writeText: () => {},
    },
});

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

    it('copies to clipboard when clicking copy button', async () => {
        const user = userEvent.setup()
        jest.spyOn(navigator.clipboard, "writeText");

        render(
            <SnackbarProvider>
                <Address 
                    address={MYADDRESS}
                    />)
            </SnackbarProvider>
        );

        const icon = screen.getByTestId("copy-button");
        expect(icon).toBeInTheDocument();

        await user.click(icon);

        expect(navigator.clipboard.writeText).toBeCalledTimes(1);
        expect(navigator.clipboard.writeText).toBeCalledWith(MYADDRESS);
    })
})
