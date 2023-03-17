import { BigNumber, Signer } from "ethers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { formatEthersNumber } from "../utils/bignumber";

export default function Balance() {
    const balance = useSelector((state: RootState) => state.account.balance);
    let balanceString = `${balance?.currency} ${formatEthersNumber(BigNumber.from(balance?.amount), 4)}`;
    return (<span>{balanceString}</span>);
}
