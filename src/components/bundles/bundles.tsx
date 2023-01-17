import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useReducer, useState } from "react";
import { getInsuranceApi, InsuranceApi } from "../../backend/insurance_api";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrency } from "../../utils/numbers";
import { LinkBehaviour } from "../link_behaviour";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { bundleReducer, BundleActionType } from "../../context/bundle_reducer";
import { useSnackbar } from "notistack";
import { FormControlLabel, Switch } from "@mui/material";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from "dayjs";
import Timestamp from "../timestamp";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { BigNumber } from "ethers";
import StakeUsageIndicator from "./stake_usage_indicator";

export interface BundlesProps {
    insurance: InsuranceApi;
}

export default function Bundles(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const { enqueueSnackbar } = useSnackbar();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const provider = useSelector((state: RootState) => state.chain.provider);
    const isStakingSupported = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS !== undefined && process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS !== "";

    // handle bundles via reducer to avoid duplicates that are caused by the async nature of the data retrieval and the fact that react strictmode initialize components twice
    const [ bundleState, dispatch ] = useReducer(bundleReducer, { bundles: [], loading: false });
    const [ pageSize, setPageSize ] = useState(5);
    const [ showAllBundles, setShowAllBundles ] = useState(true);
    const [ address, setAddress ] = useState("");

    function handleShowAllBundlesChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setShowAllBundles(!showAllBundles);
    }

    const getBundles = useCallback(async () => {
        if (bundleState.loading) {
            return;
        }

        dispatch({ type: BundleActionType.START_LOADING });
        dispatch({ type: BundleActionType.RESET });

        const walletAddress = await signer?.getAddress();
        setAddress(walletAddress ?? "");

        if (walletAddress === undefined ) {
            dispatch({ type: BundleActionType.STOP_LOADING });
            return;
        }

        // this will return the count for all bundles in the system (right now this is the only way to get to bundles)
        const iapi = await getInsuranceApi(enqueueSnackbar, t, signer, provider).invest;
        const bundlesCount = await iapi.bundleCount();
        for (let i = 0; i < bundlesCount; i++) {
            const bundleId = await iapi.bundleId(i);
            const bundle = await iapi.bundle(bundleId, showAllBundles ? undefined : walletAddress);
            // bundle() will return undefined if bundles is not owned by the wallet address
            if (bundle === undefined ) {
                continue;
            }
            console.log("bundle: ", bundle);
            dispatch({ type: BundleActionType.ADD, bundle: bundle });
        }
        dispatch({ type: BundleActionType.STOP_LOADING });
    }, [provider, signer, bundleState.loading, enqueueSnackbar, t, showAllBundles]);

    useEffect(() => {
        getBundles();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [signer, showAllBundles]); // update bundles when signer changes

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: t('table.header.id'), 
            flex: 0.2,
            valueGetter: (params: GridValueGetterParams<any, BundleData>) => params.row,
            renderCell: (params: GridRenderCellParams<BundleData>) => {
                if (params.value?.owner === address) {
                    return (<>{params.value?.id} &nbsp; <FontAwesomeIcon icon={faUser} /></>)
                }
                return params.value?.id
            }
        },
        { 
            field: 'name', 
            headerName: t('table.header.name'), 
            flex: 1,
        },
        { 
            field: 'state', 
            headerName: t('table.header.state'), 
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams<number>) => t('bundle_state_' + params.value, { ns: 'common'}),
        },
        { 
            field: 'capital', 
            headerName: t('table.header.capital'), 
            flex: 0.65,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                console.log(params.value);
                const capital = formatCurrency(params.value, props.insurance.usd2Decimals);
                return `${props.insurance.usd2} ${capital}`;
            }
        },
        { 
            field: 'capacity', 
            headerName: t('table.header.capacity'), 
            flex: 0.65,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                const capacity = formatCurrency(params.value, props.insurance.usd2Decimals);
                return `${props.insurance.usd2} ${capacity}`
            }
        },
        { 
            field: 'createdAt', 
            headerName: t('table.header.created'), 
            flex: 0.65,
            renderCell: (params: GridRenderCellParams<number>) => <Timestamp at={params.value ?? 0} />
        },
        { 
            field: 'lifetime', 
            headerName: t('table.header.lifetime'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams<any, BundleData>) => params.row,
            renderCell: (params: GridRenderCellParams<BundleData>) => {
                const bundle = params.value!;
                const lifetime = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 'seconds').unix();
                return (<Timestamp at={lifetime} />);
            }
        },
        { 
            field: 'policies', 
            headerName: t('table.header.policies'), 
            flex: 0.3
        },
    ];

    if (isStakingSupported) {
        columns.splice(5, 0, {
            field: 'stakeUsage', 
            headerName: t('table.header.stake_usage'), 
            flex: 0.3,
            valueGetter: (params: GridValueGetterParams<any, BundleData>) => {
                const capitalSupport = params.row.capitalSupport !== undefined ? BigNumber.from(params.row.capitalSupport) : undefined;
                const lockedCapital = params.row.locked !== undefined ? BigNumber.from(params.row.locked) : BigNumber.from(0);
                let stakeUsage = undefined;
                if (capitalSupport !== undefined) {
                    if (capitalSupport.gt(0)) {
                        stakeUsage = lockedCapital.mul(100).div(capitalSupport).toNumber() / 100;
                    } else {
                        stakeUsage = BigNumber.from(0);
                    }
                }
                return [ stakeUsage, capitalSupport, lockedCapital, props.insurance.usd2, props.insurance.usd2Decimals ];
            },
            renderCell: (params: GridRenderCellParams<[number|undefined, BigNumber, BigNumber, string, number]>) => {
                const stakeUsage = params.value![0];
                const supportingAmount = params.value![1];
                const lockedAmount = params.value![2] !== undefined ? params.value![2] : BigNumber.from(0);
                return (<StakeUsageIndicator
                            stakeUsage={stakeUsage}
                            lockedCapital={lockedAmount}
                            supportedCapital={supportingAmount}
                            supportedToken={params.value![3]}
                            supportedTokenDecimals={params.value![4]}
                            />);
            }
        });
    }

    function GridToolbar() {
        return (
            <GridToolbarContainer >
                <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel 
                        control={
                            <Switch
                                defaultChecked={showAllBundles}
                                value={showAllBundles} 
                                onChange={handleShowAllBundlesChanged}
                                sx={{ ml: 1 }}
                                />} 
                        label={t('action.all_mine_bundles')} />   
                </Box>
                {/* aligned right beyond here */}
                <Link component={LinkBehaviour} href="/invest" passHref style={{ textDecoration: 'none' }}>
                    <Button variant="text" color="secondary">
                        {t('action.create_bundle')}
                    </Button>
                </Link>
            </GridToolbarContainer>
        );
    }

    const loadingBar = bundleState.loading ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <DataGrid 
                autoHeight
                rows={bundleState.bundles} 
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
                />
        </>
    );
}