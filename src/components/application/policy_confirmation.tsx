import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertTitle, Button, Grid, Typography, useTheme } from "@mui/material";
import { BigNumber } from "ethers";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { formatAddress } from "../../utils/address";
import { formatCurrencyBN } from "../../utils/numbers";

interface PolicyConfirmationProps {
    processId: string;
    wallet: string;
    amount: BigNumber;
    currency: string;
    currencyDecimals: number;
    coverageDurationSeconds: number;
}

export default function PolicyConfirmation(props: PolicyConfirmationProps) {
    const router = useRouter();
    const { t } = useTranslation(['application']);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    return (<>
        <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
            <Grid item xs={12}>
                <Alert 
                    severity="success" 
                    variant="filled" 
                    sx={{ mb: 2 }} 
                    icon={<FontAwesomeIcon icon={faFileSignature} fontSize="4rem" />}
                    >
                    <AlertTitle>{t('confirmation.alert.title')}</AlertTitle>
                    <Typography variant="body2">
                    {t('confirmation.alert.text', {
                        walletAddress: formatAddress(props.wallet),
                        amount: formatCurrencyBN(props.amount, props.currencyDecimals),
                        currency: props.currency,
                        endDate: moment().add(props.coverageDurationSeconds, 's').format("DD/MM/YYYY"),
                        policyId: props.processId
                    })}
                    </Typography>
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <Button size="small" variant="text" onClick={() => router.push("/policies")}>
                    {t('confirmation.continue_link')}
                </Button>
            </Grid>
        </Grid>
    </>);
}