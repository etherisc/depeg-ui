import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertTitle, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setClaimedPolicy } from "../../redux/slices/policies";
import { RootState } from "../../redux/store";
import { formatAddress } from "../../utils/address";

export default function ClaimSuccess(props: any) {
    const { t } = useTranslation(['policies', 'common']);
    const router = useRouter();
    const claimedPolicy = useSelector((state: RootState) => state.policies.claimedPolicy);
    const dispatch = useDispatch();

    function cont() {
        dispatch(setClaimedPolicy(null));
        router.push("/policies");
    }

    return (
        <>
            <Grid container maxWidth={{ 'xs': 'none', 'md': 'md'}} spacing={2} mt={{ 'xs': 0, 'md': 2 }} 
                sx={{ p: 1, ml: { 'xs': 'none', 'md': 'auto'}, mr: { 'xs': 'none', 'md': 'auto'} }} >
                <Grid item xs={12}>
                    <Alert 
                        severity="success" 
                        variant="filled" 
                        sx={{ mb: 2 }} 
                        icon={<FontAwesomeIcon icon={faThumbsUp} fontSize="4rem" />}
                        >
                        <AlertTitle>{t('claim_success.alert.title')}</AlertTitle>
                        <Typography variant="body2">
                        {t('claim_success.alert.message', {
                            policy_holder_wallet: formatAddress(claimedPolicy?.policyHolder ?? "0x0"),
                        })}
                        </Typography>
                    </Alert>
                </Grid>
                <Grid item xs={12}>
                    <Button size="small" variant="text" onClick={cont}>
                        {t('claim_success.continue_link')}
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}