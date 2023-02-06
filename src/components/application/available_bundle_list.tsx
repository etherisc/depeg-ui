import { Table, TableHead, TableRow, TableCell, TableBody, Typography, LinearProgress, Checkbox, styled, tableCellClasses } from "@mui/material";
import { blue, blueGrey, grey, lightBlue } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { minBigNumber } from "../../utils/bignumber";
import { formatCurrencyBN } from "../../utils/numbers";

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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.common.white,
        },
    }));

    return (<>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('bundles.title')}</Typography>
            {progress}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 'lg' }} size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>{t('bundles.id')}</StyledTableCell>
                            <StyledTableCell>{t('bundles.name')}</StyledTableCell>
                            <StyledTableCell align="right">{t('bundles.apr')}</StyledTableCell>
                            <StyledTableCell align="right">{t('bundles.suminsured', { currency: props.currency })}</StyledTableCell>
                            <StyledTableCell align="right">{t('bundles.duration')}</StyledTableCell>
                            <StyledTableCell align="right">{t('bundles.capacity', { currency: props.currency })}</StyledTableCell>
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

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(even)': {
            backgroundColor: blueGrey[100],
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.secondary.light,
        },
        '&:nth-of-type(odd):hover': {
            backgroundColor: blueGrey[200],
        },
        '&:nth-of-type(even):hover': {
            backgroundColor: blueGrey[200],
        },
        '&.Mui-selected:hover': {
            backgroundColor: theme.palette.secondary.light,
        }
    }));

    return (<StyledTableRow
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
        </StyledTableRow>);
}