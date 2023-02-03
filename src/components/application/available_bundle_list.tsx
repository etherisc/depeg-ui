import { Table, TableHead, TableRow, TableCell, TableBody, Typography, LinearProgress, Checkbox } from "@mui/material";
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
    bundlesLoading: boolean;
    applicableBundleIds: Array<number>|undefined;
    selectedBundleId: number | undefined;
    currency: string;
    currencyDecimals: number;
    onBundleSelected: (bundle: BundleData) => void;
}

export function AvailableBundleList(props: AvailableBundleListProps) {
    const { t } = useTranslation('application');
    let bundlesToShow = props.bundles;

    if (props.applicableBundleIds !== undefined ) {
        bundlesToShow = bundlesToShow.filter(bundle => props.applicableBundleIds?.includes(bundle.id));
    }

    const progress = props.bundlesLoading ? 
        (<LinearProgress />) 
        : null;

    // TODO: show premium mount in row (calculate in background and update when available) -
    // TODO: abort premium calculation loop when input changes and reset calculated premiums
    // TODO: mobile view

    return (<>
            {/* TODO: text your policy can be covered by multiple bundles. Select the one you want to use. */}
            <Typography variant="subtitle2" >{t('bundles.title')}</Typography>
            {progress}
            {/* TODO: change bundle selected color */}
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bundlesToShow.map((bundle: BundleData) => (
                            <AvailableBundleRow 
                                key={bundle.id} 
                                bundle={bundle} 
                                currency={props.currency} 
                                currencyDecimals={props.currencyDecimals} 
                                selected={props.selectedBundleId === bundle.id}
                                onBundleSelected={props.onBundleSelected}
                                />
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
    selected: boolean;
    onBundleSelected: (bundle: BundleData) => void;
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
        selected={compProps.selected}
        onClick={() => compProps.onBundleSelected(bundle)}
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
        </TableRow>);
}