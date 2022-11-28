import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import { InsuranceApi } from "../../backend/insurance_api";
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { PolicyRowView } from "../../model/policy";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LinkBehaviour } from "../shared/link_behaviour";
import Link from "@mui/material/Link";
import { PolicyData } from "../../backend/policy_data";
import LinearProgress from "@mui/material/LinearProgress";
import { formatCurrency } from "../../utils/numbers";
import moment from "moment";
import { formatDate } from "../../utils/date";
import { getPolicyEnd, getPolicyState } from "../../utils/product_formatter";

export interface PoliciesProps {
    insurance: InsuranceApi;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies', 'common']);
    const appContext = useContext(AppContext);

    const [ policies, setPolicies ] = useState<Array<PolicyRowView>>([]);
    const [ policyRetrievalInProgess , setPolicyRetrievalInProgess ] = useState(false);
    const [ pageSize, setPageSize ] = useState(5);

    const [ showActivePoliciesOnly, setShowActivePoliciesOnly ] = useState<boolean>(false);
    function handleShowActivePoliciesOnlyChange(event: React.ChangeEvent<HTMLInputElement>) {
        setShowActivePoliciesOnly(! showActivePoliciesOnly);
    }

    useEffect(() => {
        function convertPolicyDataToRowView(policy: PolicyData) {
            const state = getPolicyState(policy);
            return {
                id: policy.processId,
                walletAddress: policy.owner,
                insuredAmount: `${props.insurance.usd1} ${formatCurrency(policy.suminsured.toNumber(), props.insurance.usd1Decimals)}`,
                created: formatDate(moment.unix(policy.createdAt.toNumber())),
                coverageUntil: formatDate(getPolicyEnd(policy)),
                state: t('application_state_' + state, { ns: 'common'}),
            } as PolicyRowView;
        }

        async function getPolicies() {
            const walletAddress = await appContext?.data.signer?.getAddress();
            if (walletAddress !== undefined) {
                setPolicyRetrievalInProgess(true);
                setPolicies([]);
                const policiesCount = await props.insurance.policiesCount(walletAddress);
                for (let i = 0; i < policiesCount; i++) {
                    const policy = await props.insurance.policy(walletAddress, i);
                    if (showActivePoliciesOnly && (policy.applicationState !== 2 || policy.policyState !== 0)) {
                        continue;
                    }
                    const rowView = convertPolicyDataToRowView(policy);
                    setPolicies(policies => [...policies, rowView]);
                }
                setPolicyRetrievalInProgess(false);
            } else {
                setPolicies([]);
            }
        }
        getPolicies();
    }, [appContext?.data.signer, props.insurance, showActivePoliciesOnly, t]);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('table.header.id'), flex: 1 },
        // TODO: add copy button to field and shorten content
        { field: 'walletAddress', headerName: t('table.header.walletAddress'), flex: 1 },
        { field: 'insuredAmount', headerName: t('table.header.insuredAmount'), flex: 0.5 },
        { field: 'created', headerName: t('table.header.createdDate'), flex: 0.5 },
        { field: 'coverageUntil', headerName: t('table.header.coverageUntil'), flex: 0.5 },
        { field: 'state', headerName: t('table.header.status'), flex: 0.5 },
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

    const loadingBar = policyRetrievalInProgess ? <LinearProgress /> : null;

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
                />
        </>
    );
}