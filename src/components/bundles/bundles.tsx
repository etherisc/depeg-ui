import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { BackendApi } from "../../backend/backend_api";
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridToolbarContainer, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import LinearProgress from "@mui/material/LinearProgress";
import { BundleData } from "../../backend/bundle_data";
import { formatCurrencyBN } from "../../utils/numbers";
import { LinkBehaviour } from "../link_behaviour";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import { FormControlLabel, Switch } from "@mui/material";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from "dayjs";
import Timestamp from "../timestamp";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";
import StakeUsageIndicator from "./stake_usage_indicator";
import { calculateStakeUsage, isStakingSupported } from "../../utils/staking";
import { addBundle, finishLoading, reset, startLoading } from "../../redux/slices/bundles";
import BundlesList from "./bundles_list";
import ShowBundle from "./show_bundle";

export interface BundlesProps {
    backend: BackendApi;
}

export default function Bundles(props: BundlesProps) {
    const showBundle = useSelector((state: RootState) => state.bundles.showBundle);

    if (showBundle !== undefined) {
        return (<ShowBundle backend={props.backend} />);
    } else {
        return (<BundlesList insurance={props.backend} />);
    }

}