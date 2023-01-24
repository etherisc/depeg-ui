import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { BackendApi } from "../../backend/backend_api";

interface PriceProps {
    insurance: BackendApi;
}

export default function Price(props: PriceProps) {
    const { t } = useTranslation(['price', 'common']);

    return (<>
        <Typography variant="h5" mb={2}>{t('title')}</Typography>
    </>);
}