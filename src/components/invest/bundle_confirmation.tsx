import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertTitle, Button, Card, CardActions, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { formatAddress } from "../../utils/address";

interface BundleConfirmationProps {
    bundleId: string;
    currency: string;
    currencyDecimals: number;
    investedAmount: BigNumber;
    minSumInsured: BigNumber;
    maxSumInsured: BigNumber;
    minCoverage: number;
    maxCoverage: number;
    apr: number;
}

export default function BundleConfirmation(props: BundleConfirmationProps) {
    const router = useRouter();
    const { t } = useTranslation(['invest']);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    async function copyAddressToClipboard(value: string) {
        await navigator.clipboard.writeText(value);
        enqueueSnackbar(t('action.address_copied', { ns: "common" }),  { autoHideDuration: 2000, variant: 'info' });
    }

    return (<>
        <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
            <Grid item xs={12}>
                <Alert 
                    severity="success" 
                    variant="filled" 
                    sx={{ mb: 2 }}
                    icon={<FontAwesomeIcon icon={faCircleDollarToSlot} fontSize="4rem" />}
                    >
                    <AlertTitle>{t('confirmation.alert.title')}</AlertTitle>
                    {t('confirmation.alert.text')}
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5">
                            {t('confirmation.title')}
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1}}>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    {t('confirmation.id')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.bundleId}
                                    &nbsp;
                                    <Typography component="span" color={theme.palette.secondary.main}>
                                        <FontAwesomeIcon icon={faCopy} className="fa cursor-pointer" onClick={() => copyAddressToClipboard(props.bundleId)} />
                                    </Typography>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    {t('confirmation.invested_amount')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.currency} {formatUnits(props.investedAmount, props.currencyDecimals)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                {t('confirmation.sum_insured')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                {props.currency} {formatUnits(props.minSumInsured, props.currencyDecimals)}
                                &nbsp;-&nbsp;
                                {formatUnits(props.maxSumInsured, props.currencyDecimals)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                {t('confirmation.coverage_duration')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                {props.minCoverage}
                                &nbsp;-&nbsp;
                                {props.maxCoverage} {t('days')}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                {t('confirmation.apr')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.apr}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="text" onClick={() => router.push("/bundles")}>
                            {t('confirmation.continue_link')}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    </>);
}