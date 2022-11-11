import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/signer_context";
import { InsuranceApi } from "../../model/insurance_api";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PolicyRowView } from "../../model/policy";

export interface PoliciesProps {
    insurance: InsuranceApi;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies']);
    const signerContext = useContext(SignerContext);

    const [ policies, setPolicies ] = useState<Array<PolicyRowView>>([]);

    useEffect(() => {
        async function getPolicies() {
            const walletAddress = await signerContext?.data.signer?.getAddress();
            if (walletAddress !== undefined) {
                setPolicies(await props.insurance.policies(walletAddress));
            } else {
                setPolicies([]);
            }
        }
        getPolicies();
    }, [signerContext?.data.signer, props.insurance]);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: t('table.header.id'), width: 150 },
        { field: 'walletAddress', headerName: t('table.header.walletAddress'), flex: 1 },
        { field: 'insuredAmount', headerName: t('table.header.insuredAmount'), flex: 0.5 },
        { field: 'coverageUntil', headerName: t('table.header.coverageUntil'), flex: 0.5 },
        { field: 'status', headerName: t('table.header.status'), flex: 0.5 },
    ];

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>

            {/* TODO: add application button */}
            {/* TODO: add 'Show only active policies' filter */}

            {/* FIXME: remove fixes height */}
            <div style={{ height: '600px', width: '100%' }}>
                <DataGrid 
                    rows={policies} 
                    columns={columns} 
                    getRowId={(row) => row.id}
                    />
            </div>
        </>
    );
}