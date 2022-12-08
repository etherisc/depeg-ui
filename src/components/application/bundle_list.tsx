import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { useTranslation } from "next-i18next";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrency } from "../../utils/numbers";

interface BundleListProps {
    bundles: Array<BundleData>;
    currency: string;
    currencyDecimals: number;
}

export function BundleList(props: BundleListProps) {
    const { t } = useTranslation('application');

    return (<>
            <Typography variant="subtitle1" sx={{ my: 1 }}>{t('bundles.title')}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>{t('bundles.bundle')}</TableCell>
                        <TableCell align="right">{t('bundles.apr')}</TableCell>
                        <TableCell align="right">{t('bundles.suminsured', { currency: props.currency })}</TableCell>
                        <TableCell align="right">{t('bundles.duration')}</TableCell>
                        <TableCell align="right">{t('bundles.capacity', { currency: props.currency })}</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.bundles.map((bundle: BundleData) => (
                        <TableRow
                        key={bundle.bundleId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {bundle.bundleId}
                        </TableCell>
                        <TableCell align="right">{bundle.apr}</TableCell>
                        <TableCell align="right">{formatCurrency(bundle.minSumInsured, props.currencyDecimals)} / {formatCurrency(bundle.maxSumInsured, props.currencyDecimals)} {props.currency}</TableCell>
                        <TableCell align="right">{bundle.minDuration / 86400 } / {bundle.maxDuration / 86400 } {t('days')}</TableCell>
                        <TableCell align="right">{formatCurrency(bundle.capacity, props.currencyDecimals)} {props.currency}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </>);
}