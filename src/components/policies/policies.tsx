import { faCircleInfo, faFileInvoiceDollar, faHandHoldingDollar, faInfoCircle, faShieldHalved, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertTitle, Container, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, gridNumberComparator, GridRenderCellParams, GridSortCellParams, gridStringOrNumberComparator, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { BigNumber } from "ethers";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SnackbarKey, useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { APPLICATION_STATE_PENDING_MINING, ClaimData, PolicyData, PolicyState } from "../../backend/policy_data";
import { addPolicy, finishLoading, reset, setClaimedPolicy, setDepegged, startLoading } from "../../redux/slices/policies";
import { RootState } from "../../redux/store";
import { DepegState } from "../../types/depeg_state";
import { bigNumberComparator } from "../../utils/bignumber";
import { formatDateUtc } from "../../utils/date";
import { TransactionFailedError } from "../../utils/error";
import { formatCurrency, formatCurrencyBN } from "../../utils/numbers";
import { getPolicyExpiration, getPolicyState } from "../../utils/product_formatter";
import Address from "../address";
import { LinkBehaviour } from "../link_behaviour";
import Timestamp from "../timestamp";
import WithTooltip from "../with_tooltip";

export interface PoliciesProps {
    backend: BackendApi;
    // **DO NOT USE IN PRODUCTION**
    // does not fetch policies from the blockchain
    testMode?: boolean;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const walletAddress = useSelector((state: RootState) => state.account.address);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);

    const dispatch = useDispatch();
    const policies = useSelector((state: RootState) => state.policies.policies);
    const isLoading = useSelector((state: RootState) => state.policies.isLoading);
    const isDepegged = useSelector((state: RootState) => state.policies.isDepegged);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [ showActivePoliciesOnly, setShowActivePoliciesOnly ] = useState<boolean>(false);
    function handleShowActivePoliciesOnlyChange(event: React.ChangeEvent<HTMLInputElement>) {
        setShowActivePoliciesOnly(! showActivePoliciesOnly);
    }

    function isActivePolicy(policy: PolicyData) {
        // underwritten
        if (policy.applicationState === 2) {
            if (policy.policyState === 0) {
                return true;
            }
        }

        return false;
    }

    const getPolicies = useCallback(async () => {
        if (walletAddress !== undefined) {
            dispatch(startLoading());
            dispatch(reset());
            const isProductDepegged = (await props.backend.getDepegState()) === DepegState.Depegged;
            if(isProductDepegged) {
                dispatch(setDepegged());
            }
            const policiesCount = await props.backend.policiesCount(walletAddress);
            for (let i = 0; i < policiesCount; i++) {
                const policy = await props.backend.policy(walletAddress, i, isProductDepegged);
                if (showActivePoliciesOnly && (! isActivePolicy(policy))) {
                    continue;
                }
                dispatch(addPolicy(policy));
            }
            if (process.env.NEXT_PUBLIC_FEATURE_GASLESS_TRANSACTION === 'true') {
                await props.backend.application.fetchPending(walletAddress, async (policyData: PolicyData) => {
                    dispatch(addPolicy(policyData));
                });
            }
            dispatch(finishLoading());
        } else {
            dispatch(startLoading());
            dispatch(reset());
            dispatch(finishLoading());
        }
    }, [walletAddress, props.backend, showActivePoliciesOnly, dispatch]);

    useEffect(() => {
        if (! props.testMode) getPolicies();
    }, [getPolicies, props.testMode]);

    function ownerBadge(policyData: PolicyData) {
        const badges: JSX.Element[] = [];
        if (policyData.policyHolder === walletAddress) {
            return (
                <WithTooltip tooltipText={t('is_owner')}>
                    <Typography color={grey[400]}>
                        <FontAwesomeIcon icon={faUser} className="fa" />
                    </Typography>
                </WithTooltip>
            );
        }
        return null;
    }

    function protectedByBadge(policyData: PolicyData) {
        if (policyData.protectedWallet === walletAddress) {
            return (
                <WithTooltip tooltipText={t('is_protected')}>
                    <Typography color={grey[400]}>
                        <FontAwesomeIcon icon={faShieldHalved} className="fa" />
                    </Typography>
                </WithTooltip>
            );
        }
        return null;
    }

    async function claim(policy: PolicyData) {
        const processId = policy.id;
        let snackbar: SnackbarKey | undefined = undefined;
        try {
            return await props.backend.application.claim(
                processId,
                (address: string) => {
                    snackbar = enqueueSnackbar(
                        t('claim_info', { address }),
                        { variant: "warning", persist: true }
                    );
                },
                () => {
                    if (snackbar !== undefined) {
                        closeSnackbar(snackbar);
                    }
                    snackbar = enqueueSnackbar(
                        t('apply_wait'),
                        { variant: "info", persist: true }
                    );
                });
        } catch(e) { 
            if ( e instanceof TransactionFailedError) {
                console.log("transaction failed", e);
                if (snackbar !== undefined) {
                    closeSnackbar(snackbar);
                }

                enqueueSnackbar(
                    t('error.transaction_failed', { ns: 'common', error: e.code }),
                    { 
                        variant: "error", 
                        persist: true,
                        action: (key) => {
                            return (
                                <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                            );
                        }
                    }
                );
                return Promise.resolve({ status: false, processId: undefined });
            } else {
                throw e;
            }
        } finally {
            await getPolicies();
            dispatch(setClaimedPolicy(policy));
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }

            router.push("/claim_success");
        }
    }

    function renderClaimCell(policy: PolicyData) {
        if (policy.applicationState === APPLICATION_STATE_PENDING_MINING && policy.transactionHash !== null) {
            const blockExplorerUrl = process.env.NEXT_PUBLIC_CHAIN_TOKEN_BLOCKEXPLORER_URL || "https://etherscan.io";
            const trxHref = blockExplorerUrl + "/tx/" + policy.transactionHash;
            return (<Button variant="text" color="secondary" href={trxHref} target="_blank">{t('action.show_trx')}</Button>);
        } else if (policy.isAllowedToClaim) {
            return (<Button variant="text" color="secondary" onClick={() => claim(policy)} data-testid="claim-button">{t('action.claim')}</Button>);
        } else {
            return (<WithTooltip tooltipText={t('claiming_not_possible')}><Button variant="text" color="secondary" onClick={() => claim(policy)} 
                        disabled={true} data-testid="claim-button">{t('action.claim')}</Button></WithTooltip>);
        }
    }

    function claimsTooltip(claim: ClaimData) {
        const symbol = props.backend.usd2;
        const usd2Decimals = props.backend.usd2Decimals;
        let paidAmount = undefined;
        if (claim === undefined) {
            return (<></>);
        }
        if (claim.state === 3 && claim.paidAmount !== undefined) { // state closed
            paidAmount = (<Typography variant="body2" data-testid="claim-paid-amount">{t('claim_paid_amount')}: {symbol} {formatCurrencyBN(BigNumber.from(claim.paidAmount), usd2Decimals)}</Typography>);
        }
        return (
            <div data-testid="claim_info_hover">
                <Typography variant="body2" data-testid="claim-amount">{t('claim_amount')}: {symbol} {formatCurrencyBN(BigNumber.from(claim.claimAmount), usd2Decimals)}</Typography>
                {paidAmount}
                <Typography variant="body2" data-testid="claim-state">{t('claim_state')}: {t('claim_state_' + claim.state)}</Typography>
                <Typography variant="body2" data-testid="claim-timestamp">{t('claim_timestamp')}: { formatDateUtc(claim.claimCreatedAt) }</Typography>
            </div>
        );
    }

    function render_application_state(policy: PolicyData) {
        const policyState = getPolicyState(policy);
        if (policyState === PolicyState.PAYOUT_EXPECTED) {
            return (<>{t('application_state_' + policyState, { ns: 'common'})}<WithTooltip tooltipText={claimsTooltip(policy.claim!)}>
                        <Typography color="secondary">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="fa" data-testid="claim-pending-icon"/>
                        </Typography>
                    </WithTooltip></>);
        } else if (policyState === PolicyState.PAIDOUT && policy.claim !== undefined) {
            return (<>{t('application_state_' + policyState, { ns: 'common'})}<WithTooltip tooltipText={claimsTooltip(policy.claim!)}>
                        <Typography color="secondary">
                            <FontAwesomeIcon icon={faInfoCircle} className="fa" data-testid="claim-pending-icon"/>
                        </Typography>
                    </WithTooltip></>);
        } else if (policyState === PolicyState.PAIDOUT) {
            return (<>{t('application_state_' + policyState, { ns: 'common'})}</>);
        }
        return (<>{t('application_state_' + policyState, { ns: 'common'})}</>);
    }

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: t('table.header.policyId'), 
            flex: 0.8,
            valueGetter: (params: GridValueGetterParams) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                if (params.value.id === '') {
                    return (<></>);
                }
                return (<><Address address={params.value!.id} iconColor="secondary.main" />{ownerBadge(params.value!)}</>);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => 
                gridStringOrNumberComparator(v1.id, v2.id, cellParams1, cellParams2)
        },
        { 
            field: 'protectedWallet', 
            headerName: t('table.header.walletAddress'), 
            flex: 0.8,
            valueGetter: (params: GridValueGetterParams) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                return (<><Address address={params.value!.protectedWallet} iconColor="secondary.main" />{protectedByBadge(params.value!)}</>);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => 
                gridStringOrNumberComparator(v1.protectedWallet, v2.protectedWallet, cellParams1, cellParams2)
        },
        { 
            field: 'protectedAmount', 
            headerName: t('table.header.protectedAmount'), 
            flex: 0.8,
            valueGetter: (params: GridValueGetterParams) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                const protectedAmount = BigNumber.from(params.value!.protectedAmount);
                const payoutCap = BigNumber.from(params.value!.payoutCap || 0);
                return (<>
                    {props.backend.usd1} {formatCurrency(protectedAmount.toNumber(), props.backend.usd1Decimals)}
                    <Tooltip title={t('payoutcap_hint', { 'currency': props.backend.usd2, 'payoutcap': formatCurrency(payoutCap.toNumber(), props.backend.usd1Decimals)})}>
                        <Typography color={grey[400]} component="span">
                            <FontAwesomeIcon icon={faCircleInfo} className="fa" data-testid="icon-payoutcap"/>
                        </Typography>
                    </Tooltip>
                </>)},
            sortComparator: (v1: PolicyData, v2: PolicyData) => bigNumberComparator(BigNumber.from(v1.protectedAmount), BigNumber.from(v2.protectedAmount)),
        },
        { 
            field: 'createdAt', 
            headerName: t('table.header.createdDate'), 
            flex: 0.7,
            renderCell: (params: GridRenderCellParams) => <Timestamp at={params?.value ?? 0} />,
            sortComparator: gridNumberComparator,
        },
        { 
            field: 'coverageUntil', 
            headerName: t('table.header.coverageUntil'), 
            flex: 0.7,
            valueGetter: (params: GridValueGetterParams<any, PolicyData>) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                if (! isActivePolicy(params.value!)) {
                    return (<></>);
                }
                const exp = getPolicyExpiration(params.row)
                return (<Timestamp at={exp} />);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => {
                const exp1 = getPolicyExpiration(v1);
                const exp2 = getPolicyExpiration(v2);   
                return gridNumberComparator(exp1, exp2, cellParams1, cellParams2);
            },
        },
        { 
            field: 'applicationState', 
            headerName: t('table.header.status'), 
            flex: 0.9,
            valueGetter: (params: GridValueGetterParams<any, PolicyData>) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                return render_application_state(params.value!);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => {
                const state1 = getPolicyState(v1);
                const state2 = getPolicyState(v2);
                return gridStringOrNumberComparator(state1, state2, cellParams1, cellParams2);
            },
        },
        {
            field: 'action',
            headerName: t('table.header.action'), 
            sortable: false,
            flex: 0.6,
            valueGetter: (params: GridValueGetterParams<any, PolicyData>) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                return renderClaimCell(params.value!);
            },
        }
    ];

    function GridToolbar() {
        return (
            <GridToolbarContainer >
                <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel 
                        control={
                            <Switch
                                defaultChecked={showActivePoliciesOnly}
                                value={showActivePoliciesOnly} 
                                onChange={handleShowActivePoliciesOnlyChange}
                                sx={{ ml: 1 }}
                                />} 
                        label={t('action.filter_active')} />   
                </Box>
                {/* aligned right beyond here */}
                <Link component={LinkBehaviour} href="/" passHref style={{ textDecoration: 'none' }}>
                    <Button variant="text" color="secondary">
                        {t('action.create_application')}
                    </Button>
                </Link>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        if (! isConnected) {
            return (<Container maxWidth={false} sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                <Alert variant="standard" severity="info">
                    <Trans i18nKey="alert.no_wallet_connected" t={t} />
                </Alert>
            </Container>);
        }
        return (<Container maxWidth={false} sx={{ height: 1, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                <Trans i18nKey="no_policies" t={t}>
                    <Link href="/">click here</Link>
                </Trans>
            </Container>);
    }

    const loadingBar = isLoading ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            { isDepegged && <Box sx={{ m: 2 }}>
                <Alert 
                    severity="warning" 
                    variant="filled"
                    icon={<FontAwesomeIcon icon={faHandHoldingDollar} fontSize="2rem"/>}
                    data-testid="alert-claimable-policies"
                    >
                    <AlertTitle>{t('alert.claimable_policies.title', { currency: props.backend.usd1 })}</AlertTitle>
                    {t('alert.claimable_policies.message')}
                </Alert>
            </Box>}
            
            {loadingBar}

            <DataGrid 
                autoHeight
                rows={policies} 
                columns={columns} 
                getRowId={(row) => row.id}
                components={{
                    Toolbar: GridToolbar,
                }}
                slots={{
                    noRowsOverlay: NoRowsOverlay,
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'coverageUntil', sort: 'asc' }],
                    },
                }}
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10, 20, 50]}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick={true}
                disableColumnMenu={true}
                columnBuffer={7}
                />
        </>
    );
}