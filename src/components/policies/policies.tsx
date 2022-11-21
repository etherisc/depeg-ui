import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app_context";
import { InsuranceApi } from "../../model/insurance_api";
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { PolicyRowView } from "../../model/policy";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { LinkBehaviour } from "../shared/link_behaviour";
import Link from "@mui/material/Link";

export interface PoliciesProps {
    insurance: InsuranceApi;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies']);
    const appContext = useContext(AppContext);

    const [ policies, setPolicies ] = useState<Array<PolicyRowView>>([]);
    const [ pageSize, setPageSize ] = useState(5);

    const [ showActivePoliciesOnly, setShowActivePoliciesOnly ] = useState<boolean>(false);
    function handleShowActivePoliciesOnlyChange(event: React.ChangeEvent<HTMLInputElement>) {
        setShowActivePoliciesOnly(! showActivePoliciesOnly);
    }

    useEffect(() => {
        async function getPolicies() {
            const walletAddress = await appContext?.data.signer?.getAddress();
            if (walletAddress !== undefined) {
                setPolicies(await props.insurance.policies(walletAddress, showActivePoliciesOnly));
            } else {
                setPolicies([]);
            }
        }
        getPolicies();
    }, [appContext?.data.signer, props.insurance, showActivePoliciesOnly]);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('table.header.id'), width: 150 },
        { field: 'walletAddress', headerName: t('table.header.walletAddress'), flex: 1 },
        { field: 'insuredAmount', headerName: t('table.header.insuredAmount'), flex: 0.5 },
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
                <Link component={LinkBehaviour} href="/application" passHref style={{ textDecoration: 'none' }}>
                    <Button variant="text" color="secondary">
                        {t('action.create_application')}
                    </Button>
                </Link>
            </GridToolbarContainer>
        );
    }

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

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