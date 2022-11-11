import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { InsuranceApi } from "../../model/insurance_api";

export interface PoliciesProps {
    insurance: InsuranceApi;
}

export default function Policies(props: PoliciesProps) {
    const { t } = useTranslation(['policies']);

    return (
        <>
            <Typography variant="h5" mb={2}>{t('title')}</Typography>
        </>
    );
}