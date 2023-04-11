import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, FormControlLabel, Switch, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from "dayjs";
import { BigNumber } from "ethers";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { BundleData } from "../../backend/bundle_data";
import { addBundle, finishLoading, reset, setMaxActiveBundles, showBundle, startLoading } from "../../redux/slices/bundles";
import { RootState } from "../../redux/store";
import { ga_event } from "../../utils/google_analytics";
import { formatCurrencyBN } from "../../utils/numbers";
import { calculateStakeUsage, isStakingSupported } from "../../utils/staking";
import { LinkBehaviour } from "../link_behaviour";
import Timestamp from "../timestamp";
import StakeUsageIndicator from "./stake_usage_indicator";

export interface BundlesProps {
    backend: BackendApi;
}

export default function BundlesListDesktop(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();

    const signer = useSelector((state: RootState) => state.chain.signer);
    const address = useSelector((state: RootState) => state.account.address);
    const bundles = useSelector((state: RootState) => state.bundles.bundles);
    const isLoadingBundles = useSelector((state: RootState) => state.bundles.isLoadingBundles);

    const bundleManagementApi = props.backend.bundleManagement;
    
    // handle bundles via reducer to avoid duplicates that are caused by the async nature of the data retrieval and the fact that react strictmode initialize components twice
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [ showAllBundles, setShowAllBundles ] = useState(true);
    const [ hoveringOverBundleId, setHoveringOverBundleId ] = useState<number | undefined>(undefined);

    function handleShowAllBundlesChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setShowAllBundles(!showAllBundles);
    }

    useEffect(() => {
        async function getBundles() {
            dispatch(startLoading());
            dispatch(reset());
            
            if (address === undefined ) {
                dispatch(finishLoading());
                return;
            }
    
            await bundleManagementApi.fetchAllBundles((bundle: BundleData) => dispatch(addBundle(bundle)) );
            const maxActiveBundles = await bundleManagementApi.maxBundles();
            const activeBundles = await bundleManagementApi.activeBundles();
            dispatch(setMaxActiveBundles(maxActiveBundles));
            dispatch(finishLoading());
        }
        getBundles();
    }, [signer, showAllBundles, bundleManagementApi, address, dispatch]); // update bundles when signer changes

    function mouseHovering(id: number): boolean {
        return hoveringOverBundleId === id;
    }

    function renderActions(bundleData: BundleData) {
        return (<Box display="flex" justifyContent="flex-end" minWidth="100%">
            <Button variant="text" color="secondary" onClick={() => {
                ga_event("bundle_details", { category: 'navigation' });
                dispatch(showBundle(bundleData));
            }} >{t('action.details')}</Button>
        </Box>)
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
            valueFormatter: (params: GridValueFormatterParams<number>) => t('bundle_state_' + params.value, { ns: 'common'}),
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
            field: 'balance', 
            headerName: t('table.header.balance'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capital = formatCurrencyBN(params.value, props.backend.usd2Decimals);
                return `${props.backend.usd2} ${capital}`;
            }
        },
        { 
            field: 'capacity', 
            headerName: t('table.header.capacity'), 
            flex: 0.65,
            valueGetter: (params: GridValueGetterParams) => BigNumber.from(params.value),
            valueFormatter: (params: GridValueFormatterParams<BigNumber>) => {
                const capacity = formatCurrencyBN(params.value, props.backend.usd2Decimals);
                return `${props.backend.usd2} ${capacity}`
            }
        },
        { 
            field: 'lifetime', 
            headerName: t('table.header.lifetime'), 
            flex: 0.5,
            valueGetter: (params: GridValueGetterParams) => params.row,
            colSpan: (params: GridCellParams<BundleData>) => mouseHovering(params.row.id) ? 2 : 1,
            renderCell: (params: GridRenderCellParams<BundleData>) => {
                if (mouseHovering(params.value!.id)) {
                    return (renderActions(params.value!));
                }
                const bundle = params.value!;
                const lifetime = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 'seconds').unix();
                return (<Timestamp at={lifetime} />);
            },
            sortComparator: (v1: BundleData, v2: BundleData) =>  v1.createdAt - v2.createdAt,
        },
        {
            field: 'policies', 
            colSpan: (params: GridCellParams<BundleData>) => mouseHovering(params.row.id) ? 0 : 1,
            headerName: t('table.header.policies'), 
            flex: 0.3
        },
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
                return [ stakeUsage, capitalSupport, lockedCapital, props.backend.usd2, props.backend.usd2Decimals ];
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
                        sortModel: [{ field: 'apr', sort: 'asc' }, { field: 'coverageUntil', sort: 'asc' }],
                    },
                }}
                paginationModel={paginationModel}
                pageSizeOptions={[5, 10, 20, 50]}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick={true}
                disableColumnMenu={true}
                componentsProps={{ 
                    row: { 
                        onMouseEnter: (e: any) => {
                            // console.log("enter", e);
                            // onMouseEnter is also triggered when hovering over the embedded action button and we don't want to change the hover state in that case
                            if ((e.target as HTMLElement).nodeName !== 'DIV') { 
                                return;
                            }
                            const id = (e.target as HTMLElement).parentElement?.dataset?.id;
                            setHoveringOverBundleId(id !== undefined ? parseInt(id) : undefined);
                        },
                        onMouseLeave: (e: any) => {
                            // console.log("leave", e);
                            const id = (e.target as HTMLElement).parentElement?.dataset?.id;
                            if (id === undefined) {
                                return;
                            }
                            setHoveringOverBundleId(undefined);
                        },
                    },
                }}
                />
        </>
    );
}