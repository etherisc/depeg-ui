import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { getBackendApi, BackendApi } from "../../backend/backend_api";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrency, formatCurrencyBN } from "../../utils/numbers";
import { LinkBehaviour } from "../link_behaviour";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import { FormControlLabel, Switch } from "@mui/material";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from "dayjs";
import Timestamp from "../timestamp";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";
import StakeUsageIndicator from "./stake_usage_indicator";
import { calculateStakeUsage, isStakingSupported } from "../../utils/staking";
import { addBundle, finishLoading, reset, startLoading } from "../../redux/slices/bundles";

export interface BundlesProps {
    insurance: BackendApi;
}

export default function Bundles(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const provider = useSelector((state: RootState) => state.chain.provider);
    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const isLoadingBundles = useSelector((state: RootState) => state.bundles.isLoadingBundles);

    // handle bundles via reducer to avoid duplicates that are caused by the async nature of the data retrieval and the fact that react strictmode initialize components twice
    const [ pageSize, setPageSize ] = useState(10);
    const [ showAllBundles, setShowAllBundles ] = useState(true);
    // FIXME: use from redux
    const [ address, setAddress ] = useState("");

    function handleShowAllBundlesChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setShowAllBundles(!showAllBundles);
    }

    const getBundles = useCallback(async () => {
        if (isLoadingBundles) {
            return;
        }

        dispatch(startLoading());
        dispatch(reset());
        
        const walletAddress = await signer?.getAddress();
        setAddress(walletAddress ?? "");

        if (walletAddress === undefined ) {
            dispatch(finishLoading());
            return;
        }

        // this will return the count for all bundles in the system (right now this is the only way to get to bundles)
        const iapi = getBackendApi(enqueueSnackbar, t, signer, provider).invest;
        const bundlesCount = await iapi.bundleCount();
        for (let i = 0; i < bundlesCount; i++) {
            const bundleId = await iapi.bundleId(i);
            const bundle = await iapi.bundle(bundleId, showAllBundles ? undefined : walletAddress);
            // bundle() will return undefined if bundles is not owned by the wallet address
            if (bundle === undefined ) {
                continue;
            }
            // console.log("bundle: ", bundle);
            dispatch(addBundle(bundle));
        }
        dispatch(finishLoading());
    }, [provider, signer, isLoadingBundles, enqueueSnackbar, t, showAllBundles, dispatch]);

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
            },
            sortComparator: (v1: BundleData, v2: BundleData) =>  v1.id - v2.id,
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
            field: 'lifetime', 
            headerName: t('table.header.lifetime'), 
            flex: 0.7,
            valueGetter: (params: GridValueGetterParams<any, BundleData>) => params.row,
            renderCell: (params: GridRenderCellParams<BundleData>) => {
                const bundle = params.value!;
                const lifetime = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 'seconds').unix();
                return (<Timestamp at={lifetime} />);
            },
            sortComparator: (v1: BundleData, v2: BundleData) =>  v1.createdAt - v2.createdAt,
        },
        {
            field: 'apr',
            headerName: t('table.header.apr'),
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                return `${params.value.toFixed(2)}%`
            }
        },
        { 
            field: 'capital', 
            headerName: t('table.header.capital'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams<string, BundleData>) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capital = formatCurrencyBN(params.value, props.insurance.usd2Decimals);
                return `${props.insurance.usd2} ${capital}`;
            }
        },
        { 
            field: 'capacity', 
            headerName: t('table.header.capacity'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams<string, BundleData>) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capacity = formatCurrencyBN(params.value, props.insurance.usd2Decimals);
                return `${props.insurance.usd2} ${capacity}`
            }
        },
        { 
            field: 'policies', 
            headerName: t('table.header.policies'), 
            flex: 0.3
        },
    ];

    if (isStakingSupported) {
        columns.splice(7, 0, {
            field: 'stakeUsage', 
            headerName: t('table.header.stake_usage'), 
            flex: 0.3,
            valueGetter: (params: GridValueGetterParams<any, BundleData>) => {
                const capitalSupport = params.row.capitalSupport !== undefined ? BigNumber.from(params.row.capitalSupport) : undefined;
                const lockedCapital = params.row.locked !== undefined ? BigNumber.from(params.row.locked) : BigNumber.from(0);
                let stakeUsage = calculateStakeUsage(capitalSupport, lockedCapital);
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
            },
            sortComparator: (v1: [number|undefined, BigNumber, BigNumber, string, number], v2: [number|undefined, BigNumber, BigNumber, string, number]) => (v1[0] ?? -1) - (v2[0] ?? -1),
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

    const loadingBar = isLoadingBundles ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <DataGrid 
                autoHeight
                rows={bundles} 
                columns={columns} 
                getRowId={(row) => row.id}
                components={{
                    Toolbar: GridToolbar,
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'apr', sort: 'asc' }, { field: 'coverageUntil', sort: 'asc' }],
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