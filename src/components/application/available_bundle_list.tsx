import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { minBigNumber } from "../../utils/bignumber";
import { formatCurrency, formatCurrencyBN } from "../../utils/numbers";
import { calculateStakeUsage } from "../../utils/staking";
import StakeUsageIndicator from "../bundles/stake_usage_indicator";

interface AvailableBundleListProps {
    bundles: Array<BundleData>;
    currency: string;
    currencyDecimals: number;
}

export function AvailableBundleList(props: AvailableBundleListProps) {
    const { t } = useTranslation('application');

    return (<>
            <Typography variant="subtitle1" sx={{ my: 1 }}>{t('bundles.title')}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 'lg' }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('bundles.id')}</TableCell>
                            <TableCell>{t('bundles.name')}</TableCell>
                            <TableCell align="right">{t('bundles.apr')}</TableCell>
                            <TableCell align="right">{t('bundles.suminsured', { currency: props.currency })}</TableCell>
                            <TableCell align="right">{t('bundles.duration')}</TableCell>
                            <TableCell align="right">{t('bundles.capacity', { currency: props.currency })}</TableCell>
                            <TableCell align="right">{t('bundles.stake_usage')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.bundles.map((bundle: BundleData) => (
                            <AvailableBundleRow key={bundle.id} bundle={bundle} currency={props.currency} currencyDecimals={props.currencyDecimals} />
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </>);
}

interface AvailableBundleRowProps {
    bundle: BundleData;
    currency: string;
    currencyDecimals: number;
}

export function AvailableBundleRow(compProps: AvailableBundleRowProps) {
    const { t } = useTranslation('application');

    const bundle = compProps.bundle;
    const currency = compProps.currency;
    const currencyDecimals = compProps.currencyDecimals;

    function remainingCapacity(bundle: BundleData): string {
        const capacity = bundle.capacity;
        const capitalSupport = BigNumber.from(bundle.capitalSupport);
        const capitalRemaining = capitalSupport.sub(BigNumber.from(bundle.locked));
        return currency + " " + formatCurrencyBN(minBigNumber(BigNumber.from(capacity), capitalRemaining), currencyDecimals); 
    }

    return (<TableRow
        key={bundle.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell scope="row" data-testid="bundle-id">
                {bundle.id}
            </TableCell>
            <TableCell scope="row" data-testid="bundle-name">
                {bundle.name}
            </TableCell>
            <TableCell align="right" data-testid="bundle-apr">{bundle.apr}%</TableCell>
            <TableCell align="right" data-testid="bundle-suminsured">{currency} {formatCurrencyBN(BigNumber.from(bundle.minSumInsured), currencyDecimals)} / {formatCurrencyBN(BigNumber.from(bundle.maxSumInsured), currencyDecimals)}</TableCell>
            <TableCell align="right" data-testid="bundle-duration">{bundle.minDuration / 86400 } / {bundle.maxDuration / 86400 } {t('days')}</TableCell>
            <TableCell align="right" data-testid="bundle-capacity">{remainingCapacity(bundle)}</TableCell>
            <TableCell align="right" data-testid="bundle-stakeusage">
                <StakeUsageIndicator
                    stakeUsage={calculateStakeUsage(BigNumber.from(bundle.capitalSupport), BigNumber.from(bundle.locked))}
                    lockedCapital={BigNumber.from(bundle.locked)}
                    supportedCapital={BigNumber.from(bundle.capitalSupport)}
                    supportedToken={currency}
                    supportedTokenDecimals={currencyDecimals}
                    />
            </TableCell>
        </TableRow>);
}