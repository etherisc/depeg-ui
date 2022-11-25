import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useReducer, useState } from "react";
import { AppContext } from "../../context/app_context";
import { InsuranceApi } from "../../model/insurance_api";
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import { BundleRowView } from "../../model/bundle";
import { BundleData } from "../../application/insurance/bundle_data";
import { formatCurrency } from "../../utils/numbers";
import { LinkBehaviour } from "../shared/link_behaviour";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { bundleReducer, BundleActionType } from "../../context/bundle_reducer";

export interface BundlesProps {
    insurance: InsuranceApi;
}

export default function Bundles(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const appContext = useContext(AppContext);

    // handle bundles via reducer to avoid duplicates that are caused by the async nature of the data retrieval and the fact that react strictmode initialize components twice
    const [ bundleState, dispatch ] = useReducer(bundleReducer, { bundles: [], loading: false });
    const [ pageSize, setPageSize ] = useState(5);

    function convertBundleDataToRowView(bundle: BundleData) {
        const capital = formatCurrency(bundle.capital, props.insurance.usd1Decimals);
        const capitalRemaining = formatCurrency(bundle.capital - bundle.locked, props.insurance.usd1Decimals);
        return {
            id: `${bundle.bundleId}`,
            capital: `${props.insurance.usd1} ${capital} / ${capitalRemaining}`,
            policies: `${bundle.policies}`,
            state: t('bundle_state_' + bundle.state, { ns: 'common'}),
        } as BundleRowView;
    }

    useEffect(() => {
        async function getBundles() {
            const walletAddress = await appContext?.data.signer?.getAddress();
            if (walletAddress !== undefined && ! bundleState.loading) {
                dispatch({ type: BundleActionType.START_LOADING });
                dispatch({ type: BundleActionType.RESET });
                // this will return the count for all bundles in the system (right now this is the only way to get to bundles)
                const bundlesCount = await props.insurance.invest.bundleCount();
                const bundleTokenAddress = await props.insurance.invest.bundleTokenAddress();
                for (let i = 1; i <= bundlesCount; i++) { // bundle id starts at 1
                    const bundle = await props.insurance.invest.bundle(walletAddress, bundleTokenAddress, i);
                    // bundle() will return undefined if bundles is not owned by the wallet address
                    if (bundle === undefined ) {
                        continue;
                    }
                    console.log("bundle: ", bundle);
                    dispatch({ type: BundleActionType.ADD, bundle: bundle });
                }
                dispatch({ type: BundleActionType.STOP_LOADING });
            } else if (bundleState.loading) {
                console.log("bundle retrieval already in progress");
            } else {
                dispatch({ type: BundleActionType.RESET });
            }
        }
        getBundles();
    }, [appContext?.data.signer, props.insurance, t]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: t('table.header.id'), flex: 1 },
        { field: 'capital', headerName: t('table.header.capital'), flex: 1.5 },
        { field: 'policies', headerName: t('table.header.policies'), flex: 1 },
        { field: 'state', headerName: t('table.header.state'), flex: 1 },
    ];

    function GridToolbar() {
        return (
            <GridToolbarContainer >
                <Box sx={{ flexGrow: 1 }}>
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
                rows={bundleState.bundles.map(convertBundleDataToRowView)} 
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
                />
        </>
    );
}