import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import { InsuranceApi } from "../../model/insurance_api";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import { BundleRowView } from "../../model/bundle";
import { BundleData } from "../../application/insurance/bundle_data";

export interface BundlesProps {
    insurance: InsuranceApi;
}

export default function Bundles(props: BundlesProps) {
    const { t } = useTranslation(['bundles', 'common']);
    const appContext = useContext(AppContext);

    const [ bundles, setBundles ] = useState<Array<BundleRowView>>([]);
    const [ bundleRetrievalInProgess , setBundleRetrievalInProgess ] = useState(false);
    const [ pageSize, setPageSize ] = useState(5);

    useEffect(() => {
        function convertBundleDataToRowView(bundle: BundleData) {
            // const state = getPolicyState(policy);
            // return {
            //     id: policy.processId,
            //     walletAddress: policy.owner,
            //     insuredAmount: `${props.insurance.usd1} ${formatCurrency(policy.suminsured.toNumber(), props.insurance.usd1Decimals)}`,
            //     coverageUntil: getPolicyEndDate(policy),
            //     state: t('application_state_' + state, { ns: 'common'}),
            // } as PolicyRowView;
            return {
                id: "1",
            } as BundleRowView;
        }

        async function getPolicies() {
            const walletAddress = await appContext?.data.signer?.getAddress();
            if (walletAddress !== undefined) {
                setBundleRetrievalInProgess(true);
                setBundles([]);
                // const policiesCount = await props.insurance.policiesCount(walletAddress);
                // for (let i = 0; i < policiesCount; i++) {
                //     const bundle = await props.insurance.bundle(walletAddress, i);
                //     const rowView = convertBundleDataToRowView(bundle);
                //     setBundles(bundles => [...bundles, rowView]);
                // }
                setBundleRetrievalInProgess(false);
            } else {
                setBundles([]);
            }
        }
        getPolicies();
    }, [appContext?.data.signer, props.insurance, t]);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('table.header.id'), flex: 1 },
        // TODO: add copy button to field and shorten content
        { field: 'walletAddress', headerName: t('table.header.walletAddress'), flex: 1 },
        { field: 'insuredAmount', headerName: t('table.header.insuredAmount'), flex: 0.5 },
        // TODO: add date created
        { field: 'coverageUntil', headerName: t('table.header.coverageUntil'), flex: 0.5 },
        { field: 'state', headerName: t('table.header.status'), flex: 0.5 },
    ];

    const loadingBar = bundleRetrievalInProgess ? <LinearProgress /> : null;

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {loadingBar}

            <DataGrid 
                autoHeight
                rows={bundles} 
                columns={columns} 
                getRowId={(row) => row.id}
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