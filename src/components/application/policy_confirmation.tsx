import { Alert, AlertTitle, Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
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

    return (<>
        <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
            <Grid item xs={12}>
                <Alert severity="success" variant="filled" sx={{ mb: 2 }}>
                    <AlertTitle>Payment for Depeg protection premium confirmed</AlertTitle>
                    Protection is now active.
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5">
                            Protection details
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1}}>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    Id:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.processId}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    Wallet:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {formatAddress(props.wallet)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    Amount:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">
                                    {props.currency} {formatUnits(props.amount, props.currencyDecimals)}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body1">
                                    End date:
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
                            Continue to premiums overview
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    </>);
}