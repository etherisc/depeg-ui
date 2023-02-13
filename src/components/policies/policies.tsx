import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { BackendApi } from "../../backend/backend_api";
import { DataGrid, GridColDef, gridNumberComparator, GridRenderCellParams, GridScrollParams, GridSortCellParams, gridStringOrNumberComparator, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LinkBehaviour } from "../link_behaviour";
import Link from "@mui/material/Link";
import { PolicyData } from "../../backend/policy_data";
import LinearProgress from "@mui/material/LinearProgress";
import { formatCurrency } from "../../utils/numbers";
import { getPolicyExpiration, getPolicyState } from "../../utils/product_formatter";
import { BigNumber } from "ethers";
import Address from "../address";
import Timestamp from "../timestamp";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { bigNumberComparator } from "../../utils/bignumber";
import { addPolicy, finishLoading, reset, startLoading } from "../../redux/slices/policies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import WithTooltip from "../with_tooltip";
import { grey } from "@mui/material/colors";
import { ProductState } from "../../types/product_state";
import { SnackbarKey, useSnackbar } from "notistack";
import { TransactionFailedError } from "../../utils/error";

export interface PoliciesProps {
    backend: BackendApi;
    // **DO NOT USE IN PRODUCTION**
    // does not fetch policies from the blockchain
    testMode?: boolean;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies', 'common']);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const walletAddress = useSelector((state: RootState) => state.account.address);

    const dispatch = useDispatch();
    const policies = useSelector((state: RootState) => state.policies.policies);
    const isLoading = useSelector((state: RootState) => state.policies.isLoading);

    const [ pageSize, setPageSize ] = useState(10);

    const [ showActivePoliciesOnly, setShowActivePoliciesOnly ] = useState<boolean>(false);
    function handleShowActivePoliciesOnlyChange(event: React.ChangeEvent<HTMLInputElement>) {
        setShowActivePoliciesOnly(! showActivePoliciesOnly);
    }

    const getPolicies = useCallback(async () => {
        if (walletAddress !== undefined) {
            dispatch(startLoading());
            dispatch(reset());
            const isProductDepegged = (await props.backend.getProductState()) === ProductState.Depegged;
            const policiesCount = await props.backend.policiesCount(walletAddress);
            for (let i = 0; i < policiesCount; i++) {
                const policy = await props.backend.policy(walletAddress, i, isProductDepegged);
                if (showActivePoliciesOnly && (policy.applicationState !== 2 || policy.policyState !== 0)) {
                    continue;
                }
                dispatch(addPolicy(policy));
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

    function renderClaimCell(policy: PolicyData) {
        if (policy.isAllowedToClaim) {
            return (<Button variant="text" color="secondary" onClick={() => claim(policy.id)}>{t('action.claim')}</Button>);
        }
        return (<></>);
    }

    async function claim(processId: string) {
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
            if (snackbar !== undefined) {
                closeSnackbar(snackbar);
            }

            enqueueSnackbar(
                t('claim_successful'),
                { 
                    variant: "success", 
                    persist: true,
                    action: (key) => {
                        return (
                            <Button onClick={() => {closeSnackbar(key)}}>{t('action.close', { ns: 'common' })}</Button>
                        );
                    }
                }
            );
            await getPolicies();
        }
    }

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: t('table.header.policyId'), 
            flex: 1,
            valueGetter: (params: GridValueGetterParams<string, PolicyData>) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                return (<><Address address={params.value!.id} iconColor="secondary.main" />{ownerBadge(params.value!)}</>);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => 
                gridStringOrNumberComparator(v1.id, v2.id, cellParams1, cellParams2)
        },
        { 
            field: 'protectedWallet', 
            headerName: t('table.header.walletAddress'), 
            flex: 1,
            valueGetter: (params: GridValueGetterParams<string, PolicyData>) => params.row,
            renderCell: (params: GridRenderCellParams<PolicyData>) => {
                return (<><Address address={params.value!.protectedWallet} iconColor="secondary.main" />{protectedByBadge(params.value!)}</>);
            },
            sortComparator: (v1: PolicyData, v2: PolicyData, cellParams1: GridSortCellParams<any>, cellParams2: GridSortCellParams<any>) => 
                gridStringOrNumberComparator(v1.protectedWallet, v2.protectedWallet, cellParams1, cellParams2)
        },
        { 
            field: 'suminsured', 
            headerName: t('table.header.insuredAmount'), 
            flex: 1,
            valueGetter: (params: GridValueGetterParams<string, PolicyData>) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => `${props.backend.usd1} ${formatCurrency(params.value.toNumber(), props.backend.usd1Decimals)}`,
            sortComparator: (v1: BigNumber, v2: BigNumber) => bigNumberComparator(v1, v2),
        },
        { 
            field: 'createdAt', 
            headerName: t('table.header.createdDate'), 
            flex: 1,
            renderCell: (params: GridRenderCellParams<number>) => <Timestamp at={params?.value ?? 0} />,
            sortComparator: gridNumberComparator,
        },
        { 
            field: 'coverageUntil', 
            headerName: t('table.header.coverageUntil'), 
            flex: 1,
            valueGetter: (params: GridValueGetterParams<any, PolicyData>) => getPolicyExpiration(params.row),
            renderCell: (params: GridRenderCellParams<number>) => {
                return (<Timestamp at={params.value!} />);
            },
            sortComparator: gridNumberComparator,
        },
        { 
            field: 'applicationState', 
            headerName: t('table.header.status'), 
            flex: 0.6,
            valueGetter: (params: GridValueGetterParams<any, PolicyData>) => getPolicyState(params.row),
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                return t('application_state_' + params.value, { ns: 'common'})
            },
            sortComparator: gridStringOrNumberComparator,
        },
        {
            field: 'action',
            headerName: t('table.header.action'), 
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

    const loadingBar = isLoading ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <DataGrid 
                autoHeight
                rows={policies} 
                columns={columns} 
                getRowId={(row) => row.id}
                components={{
                    Toolbar: GridToolbar,
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'coverageUntil', sort: 'asc' }],
                    },
                }}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                disableSelectionOnClick={true}
                disableColumnMenu={true}
                columnBuffer={7}
                />
        </>
    );
}