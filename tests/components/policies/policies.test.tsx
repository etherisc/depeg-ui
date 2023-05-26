import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { SnackbarProvider } from 'notistack';
import Policies from '../../../src/components/policies/policies';
import { mockSimple } from '../../mocks/backend_api/backend_api_mock';
import { mockPoliciesSimple, mockPoliciesSimpleWithClaim } from '../../mocks/policies/simple';
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

describe('When rendering the policies list', () => {
    it('protected wallets, owner and protected wallet icons are shown', async () => {
        const backendApi = mockSimple();

        renderWithProviders(
            // snackbar is needed for the copy button
            <SnackbarProvider>
                <Policies
                    backend={backendApi}
                    testMode={true}
                    />
            </SnackbarProvider>
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
                            amount: parseUnits("11000", 6).toString(),
                            currency: 'USDC',
                            decimals: 6,
                        },
                        balanceUsd2: {
                            amount: parseUnits("12000", 6).toString(),
                            currency: 'USDT',
                            decimals: 6,
                        },
                    },
                    policies: {
                        policies: mockPoliciesSimple(),
                        claimedPolicy: null,
                        isLoading: false,
                        isDepegged: false,
                    }
                },
            }
        );

        await waitFor(async () => 
            expect(await screen.findAllByRole("row")).toHaveLength(4)
        );
        
        const rows = await screen.findAllByRole("row");

        expect(rows[1]).toHaveTextContent("0x2CeC…4729");
        expect(rows[1].querySelector('[data-icon="user"]')).toBeInTheDocument();
        expect(rows[1].querySelector('[data-icon="shield-halved"]')).toBeInTheDocument();
        
        const pendings = await screen.findAllByTestId("icon-payoutcap");
        expect(pendings).toHaveLength(3);

        fireEvent.mouseOver(pendings[0]);

        await waitFor(async () => {
            expect(await screen.findByText("payoutcap_hint")).toBeInTheDocument();
        }, { timeout: 3000 });

        expect(rows[2]).toHaveTextContent("0xA3C5…8814");
        expect(rows[2]).toHaveTextContent("application_state_5"); // active
        expect(rows[2].querySelector('[data-icon="user"]')).toBeInTheDocument();
        expect(rows[2].querySelector('[data-icon="shield-halved"]')).not.toBeInTheDocument();

        expect(rows[3]).toHaveTextContent("0x2CeC…4729");
        expect(rows[3].querySelector('[data-icon="user"]')).not.toBeInTheDocument();
        expect(rows[3].querySelector('[data-icon="shield-halved"]')).toBeInTheDocument();
    })

    it('a policy that is allowed to claim shows claim button', async () => {
        const backendApi = mockSimple();

        renderWithProviders(
            // snackbar is needed for the copy button
            <SnackbarProvider>
                <Policies
                    backend={backendApi}
                    testMode={true}
                    />
            </SnackbarProvider>
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
                            amount: parseUnits("11000", 6).toString(),
                            currency: 'USDC',
                            decimals: 6,
                        },
                        balanceUsd2: {
                            amount: parseUnits("12000", 6).toString(),
                            currency: 'USDT',
                            decimals: 6,
                        },
                    },
                    policies: {
                        policies: mockPoliciesSimpleWithClaim(),
                        claimedPolicy: null,
                        isLoading: false,
                        isDepegged: true,
                    }
                },
            }
        );

        await waitFor(async () => 
            expect(await screen.findAllByRole("row")).toHaveLength(6)
        );
        
        expect(screen.getByTestId("alert-claimable-policies")).toHaveTextContent("alert.claimable_policies.title");
        expect(screen.getByTestId("alert-claimable-policies")).toHaveTextContent("alert.claimable_policies.message");

        const rows = await screen.findAllByRole("row");

        expect(rows[3]).toHaveTextContent("0xccE1…CF63");
        expect(rows[3]).toHaveTextContent("application_state_8"); // claimable
        expect(rows[3].querySelector('[data-icon="user"]')).not.toBeInTheDocument();
        expect(rows[3].querySelector('[data-icon="shield-halved"]')).toBeInTheDocument();
        const claimButtons = await screen.findAllByTestId("claim-button");
        expect(claimButtons[2]).not.toHaveAttribute('disabled');
        expect(claimButtons[2]).toHaveTextContent("action.claim");
    })

    it('a policy that has an open claim shows claim info and no claim button ', async () => {
        const backendApi = mockSimple();

        renderWithProviders(
            // snackbar is needed for the copy button
            <SnackbarProvider>
                <Policies
                    backend={backendApi}
                    testMode={true}
                    />
            </SnackbarProvider>
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
                            amount: parseUnits("11000", 6).toString(),
                            currency: 'USDC',
                            decimals: 6,
                        },
                        balanceUsd2: {
                            amount: parseUnits("12000", 6).toString(),
                            currency: 'USDT',
                            decimals: 6,
                        },
                    },
                    policies: {
                        policies: mockPoliciesSimpleWithClaim(),
                        claimedPolicy: null,
                        isLoading: false,
                        isDepegged: true,
                    }
                },
            }
        );

        await waitFor(async () => 
            expect(await screen.findAllByRole("row")).toHaveLength(6)
        );
        
        const rows = await screen.findAllByRole("row");

        expect(rows[4]).toHaveTextContent("0xccE1…CF64");
        expect(rows[4]).toHaveTextContent("application_state_9"); // payout pending
        const claimButtons = await screen.findAllByTestId("claim-button");
        expect(claimButtons[3]).toHaveAttribute('disabled');


        const pendings = await screen.findAllByTestId("claim-pending-icon");
        expect(pendings).toHaveLength(2);

        fireEvent.mouseOver(pendings[0]);

        await waitFor(async () => {
            expect(await screen.findByTestId("claim-amount")).toBeInTheDocument();
        }, { timeout: 3000 });

        expect(await screen.findByTestId("claim-amount")).toHaveTextContent("USDT 10,000.00");
        expect(await screen.findByTestId("claim-state")).toHaveTextContent("claim_state_0");
        expect(await screen.findByTestId("claim-timestamp")).toHaveTextContent(dayjs().add(-1, 'days').format('YYYY-MM-DD'));
})

    it('a policy that has a closed claim shows claim info and no claim button ', async () => {
        const backendApi = mockSimple();

        renderWithProviders(
            // snackbar is needed for the copy button
            <SnackbarProvider>
                <Policies
                    backend={backendApi}
                    testMode={true}
                    />
            </SnackbarProvider>
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
                            amount: parseUnits("11000", 6).toString(),
                            currency: 'USDC',
                            decimals: 6,
                        },
                        balanceUsd2: {
                            amount: parseUnits("12000", 6).toString(),
                            currency: 'USDT',
                            decimals: 6,
                        },
                    },
                    policies: {
                        policies: mockPoliciesSimpleWithClaim(),
                        claimedPolicy: null,
                        isLoading: false,
                        isDepegged: true,
                    }
                },
            }
        );

        await waitFor(async () => 
            expect(await screen.findAllByRole("row")).toHaveLength(6)
        );
        
        const rows = await screen.findAllByRole("row");

        expect(rows[4]).toHaveTextContent("0xccE1…CF64");
        expect(rows[4]).toHaveTextContent("application_state_9"); // payout pending
        const claimButtons = await screen.findAllByTestId("claim-button");
        expect(claimButtons[3]).toHaveAttribute('disabled');

        const pendings = await screen.findAllByTestId("claim-pending-icon");
        expect(pendings).toHaveLength(2);

        fireEvent.mouseOver(pendings[1]);

        await waitFor(async () => {
            expect(await screen.findByTestId("claim-amount")).toBeInTheDocument();
            expect(await screen.findByTestId("claim-amount")).toHaveTextContent("USDT 8,000.00");
            expect(await screen.findByTestId("claim-state")).toHaveTextContent("claim_state_3");
            expect(await screen.findByTestId("claim-timestamp")).toHaveTextContent(dayjs().add(-1, 'days').format('YYYY-MM-DD'));
            expect(await screen.findByTestId("claim-paid-amount")).toHaveTextContent("USDT 5,000.00");
        });
    })


})
