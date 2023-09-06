import { faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Container, FormControlLabel, Switch, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, GridRenderCellParams, GridRowParams, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from "dayjs";
import { BigNumber } from "ethers";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BundleData } from "../../backend/bundle_data";
import { showBundle } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { formatBundleState } from "../../utils/bundles";
import { ga_event } from "../../utils/google_analytics";
import { formatCurrencyBN } from "../../utils/numbers";
import { calculateStakeUsage, isStakingSupported } from "../../utils/staking";
import { LinkBehaviour } from "../link_behaviour";
import Timestamp from "../timestamp";
import StakeUsageIndicator from "./stake_usage_indicator";
import { bigNumberComparator } from "../../utils/bignumber";

export interface BundlesProps {
    usd2: string;
    usd2Decimals: number;
}

export default function BundlesListDesktop(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const dispatch = useDispatch();
    const theme = useTheme();

    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    const address = useSelector((state: RootState) => state.account.address);
    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const isLoadingBundles = useSelector((state: RootState) => state.bundles.isLoadingBundles);
    
    // handle bundles via reducer to avoid duplicates that are caused by the async nature of the data retrieval and the fact that react strictmode initialize components twice
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [ showAllBundles, setShowAllBundles ] = useState(true);

    function handleShowAllBundlesChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setShowAllBundles(!showAllBundles);
    }

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: t('table.header.id'), 
            flex: 0.2,
            valueGetter: (params: GridValueGetterParams) => params.row,
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
            valueGetter: (params: GridValueGetterParams) => params.row,
            valueFormatter: (params: GridValueFormatterParams<BundleData>) => formatBundleState(params.value!, t),
            sortComparator: (v1: BundleData, v2: BundleData) =>  v2.state - v1.state,
        },
        {
            field: 'apr',
            headerName: t('table.header.apr'),
            flex: 0.3,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                return `${params.value.toFixed(2)}%`
            },
            sortComparator: (v1: number, v2: number) =>  v2 - v1,
        },
        { 
            field: 'balance', 
            headerName: t('table.header.balance'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capital = formatCurrencyBN(params.value, props.usd2Decimals, 2);
                return `${props.usd2} ${capital}`;
            },
            sortComparator: (v1: BigNumber, v2: BigNumber) => bigNumberComparator(v1, v2)
        },
        { 
            field: 'capacity', 
            headerName: t('table.header.capacity'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capacity = formatCurrencyBN(params.value, props.usd2Decimals, 2);
                return `${props.usd2} ${capacity}`
            },
            sortComparator: (v1: BigNumber, v2: BigNumber) => bigNumberComparator(v1, v2)
        },
        { 
            field: 'lifetime', 
            headerName: t('table.header.lifetime'), 
            flex: 0.5,
            valueGetter: (params: GridValueGetterParams) => params.row,
            colSpan: 1,
            renderCell: (params: GridRenderCellParams<BundleData>) => {
                const bundle = params.value!;
                const lifetime = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 'seconds').unix();
                return (<Timestamp at={lifetime} />);
            },
            sortComparator: (v1: BundleData, v2: BundleData) => {
                const expiredAtV1 = dayjs.unix(v1.createdAt).add(parseInt(v1.lifetime), 'seconds').unix();
                const expiredAtV2 = dayjs.unix(v2.createdAt).add(parseInt(v2.lifetime), 'seconds').unix();
                return expiredAtV1 - expiredAtV2;
            }
        },
        {
            field: 'policies', 
            colSpan: 1,
            headerName: t('table.header.policies'), 
            flex: 0.3
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 0.2,
            headerName: '', 
            valueGetter: (params: GridValueGetterParams) => params.row,
            getActions: (params: GridRowParams) => {
                const bundleData = params.row as BundleData;
                return [
                <GridActionsCellItem 
                    key={"details" + bundleData.id} 
                    icon={
                        <FontAwesomeIcon icon={faEye} color={theme.palette.primary.main} />
                    } 
                    title={t('action.details')}
                    onClick={() => {
                        console.log("show bundle details");
                        ga_event("bundle_details", { category: 'navigation' });
                        dispatch(showBundle(bundleData));
                    }} 
                    label="Details" 
                    />,
            ]}
        }
    ];

    if (isStakingSupported) {
        columns.splice(6, 0, {
            field: 'stakeUsage', 
            headerName: t('table.header.stake_usage'), 
            flex: 0.3,
            valueGetter: (params: GridValueGetterParams) => {
                const capitalSupport = params.row.capitalSupport !== undefined ? BigNumber.from(params.row.capitalSupport) : undefined;
                const lockedCapital = params.row.locked !== undefined ? BigNumber.from(params.row.locked) : BigNumber.from(0);
                let stakeUsage = calculateStakeUsage(capitalSupport, lockedCapital);
                return [ stakeUsage, capitalSupport, lockedCapital, props.usd2, props.usd2Decimals ];
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
                <Link component={LinkBehaviour} href="/stake" passHref style={{ textDecoration: 'none' }}>
                    <Button variant="text" color="secondary">
                        {t('action.create_bundle')}
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
                <Trans i18nKey="no_bundles" t={t}>
                    <Link href="/stake">click here</Link>
                </Trans>
            </Container>);
    }

    const loadingBar = isLoadingBundles ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <DataGrid 
                autoHeight
                rows={bundles.filter((bundle) => showAllBundles || bundle.owner === address)} 
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
                        sortModel: [{ field: 'apr', sort: 'asc' }],
                    },
                }}
                sortingOrder={['desc', 'asc']}
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10, 20, 50]}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick={true}
                disableColumnMenu={true}
                columnBuffer={9}
                />
        </>
    );
}