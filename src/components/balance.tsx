import { BigNumber, Signer } from "ethers";
import { useEffect, useState } from "react";
import { formatEthersNumber } from "../utils/bignumber";

export interface BalanceProps {
    signer: Signer;
    currency: string;
}

export default function Balance(props: BalanceProps) {
    const [ balance, setBalance ] = useState(BigNumber.from(-1));

    useEffect(() => {
        // console.log("signer changed");
        async function updateData() {
            const balance = await props.signer.getBalance();
            setBalance(balance);
        }
        updateData();
    }, [props]);

    let balanceString = `${props.currency} ${formatEthersNumber(balance, 4)}`;
    return (<span>{balanceString}</span>);
}
