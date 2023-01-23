import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { InsuranceApi } from "../../backend/insurance_api";

interface PriceProps {
    insurance: InsuranceApi;
}

export default function Price(props: PriceProps) {
    const { t } = useTranslation(['price', 'common']);

    return (<>
        <Typography variant="h5" mb={2}>{t('title')}</Typography>
    </>);
}