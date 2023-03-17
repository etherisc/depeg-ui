import { Table, TableHead, TableRow, TableCell, TableBody, Typography, LinearProgress, styled, tableCellClasses, Alert } from "@mui/material";
import { blue, blueGrey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Color from "color";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { BundleData } from "../../backend/bundle_data";
import { RootState } from "../../redux/store";
import { minBigNumber } from "../../utils/bignumber";
import { formatCurrencyBN } from "../../utils/numbers";

interface AvailableBundleListProps {
    formDisabled: boolean;
    isWalletConnected: boolean;
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

    bundlesToShow = bundlesToShow.slice().sort((a, b) => { return a.apr - b.apr; });

    const progress = props.bundlesLoading ? 
        (<LinearProgress />) 
        : null;

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.common.white,
        },
    }));

    if (! props.isWalletConnected ) {
        return (
            <Alert variant="outlined" severity="info">{t('alert.not_connected_no_bundles')}</Alert>
        );
    }

    if (! props.bundlesLoading && props.bundles.length === 0) {
        return (
            <Alert variant="outlined" severity="info">{t('alert.riskpool_capacity_exceeded')}</Alert>
        );
    }

    if (! props.bundlesLoading && bundlesToShow.length === 0) {
        return (
            <Alert variant="outlined" severity="warning">{t('alert.no_matching_bundle')}</Alert>
        );
    }

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
                                formDisabled={props.formDisabled}
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
    formDisabled: boolean;
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
        '&:nth-of-type(odd)': {
            cursor: 'pointer',
        },
        '&:nth-of-type(even)': {
            backgroundColor: blueGrey[50],
            cursor: 'pointer',
        },
        '&.Mui-selected': {
            backgroundColor: blue[200],
        },
        '&.Mui-selected > td': {
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:nth-of-type(odd):hover': {
            backgroundColor: ! compProps.formDisabled && blue[100],
        },
        '&:nth-of-type(even):hover': {
            backgroundColor: ! compProps.formDisabled && blue[100],
        },
        '&.Mui-selected:hover': {
            backgroundColor: blue[100],
        }
    }));

    return (<StyledTableRow
        key={bundle.id}
        selected={compProps.selected}
        onClick={() => {
            if (compProps.formDisabled) {
                return;
            }
            compProps.onBundleSelected(bundle)
        }}
        sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
        }}
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