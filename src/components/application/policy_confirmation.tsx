import { Alert, AlertTitle, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { formatAddress } from "../../utils/address";

interface PolicyConfirmationProps {
    processId: string;
    wallet: string;
    amount: BigNumber;
    currency: string;
    currencyDecimals: number;
    duration: number;
}

export default function PolicyConfirmation(props: PolicyConfirmationProps) {
    const router = useRouter();
    const { t } = useTranslation(['application']);

    return (<>
        <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
            <Grid item xs={12}>
                <Alert severity="success" variant="filled" sx={{ mb: 2 }}>
                    <AlertTitle>{t('confirmation.alert.title')}</AlertTitle>
                    {t('confirmaton.alert.text')}
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5">
                            {t('confirmaton.title')}
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1}}>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    {t('confirmation.id')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.processId}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    {t('confirmation.wallet')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {formatAddress(props.wallet)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                {t('confirmation.amount')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.currency} {formatUnits(props.amount, props.currencyDecimals)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                {t('confirmation.end_date')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {moment().add(props.duration, 'days').format("YYYY-MM-DD")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="text" onClick={() => router.push("/policies")}>
                            {t('confirmation.continue_link')}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    </>);
}