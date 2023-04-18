import { BigNumber, Signer } from "ethers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { formatEthersNumber } from "../utils/bignumber";
import { formatCurrencyBN } from "../utils/numbers";
import { Box } from "@mui/material";

export default function Balance(props: any) {
    const { balance, onClick } = props;
    let balanceString = `${balance?.currency} ${formatCurrencyBN(BigNumber.from(balance?.amount), balance.decimals)}`;
    return (<Box component="span" style={{ userSelect: 'none' }} onClick={onClick}>{balanceString}</Box>);
}
