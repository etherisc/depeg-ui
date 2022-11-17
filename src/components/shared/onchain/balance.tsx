import { BigNumber, Signer } from "ethers";
import { useEffect, useState } from "react";
import { AggregatorV3Interface__factory } from "../../../contracts/chainlink";
import { formatEthersNumber } from "../../../utils/bignumber";

export interface BalanceProps {
    signer: Signer;
    currency: string;
    usdAggregatorAddress?: string;
}

export default function Balance(props: BalanceProps) {
    const allowToggleBalance = props.usdAggregatorAddress !== null && props.usdAggregatorAddress !== undefined;
    const [ balance, setBalance ] = useState(BigNumber.from(-1));
    const [ balanceUsd, setBalanceUsd ] = useState(-1);
    const [ showBalanceUsd, setShowBalanceUsd ] = useState(false);

    useEffect(() => {
        // console.log("signer changed");
        async function updateData() {
            const balance = await props.signer.getBalance();
            setBalance(balance);

            if (allowToggleBalance) {
                const chainlinkAggregatorAvaxUsd = 
                AggregatorV3Interface__factory.connect(
                    props.usdAggregatorAddress!!, 
                    props.signer)
                const result = await chainlinkAggregatorAvaxUsd.latestRoundData();
                // console.log(result);
                const avaxUsdPrice = result.answer.toNumber() / 10 ** 8;
                // console.log(avaxUsdPrice);
                const balanceEth = Number.parseFloat(formatEthersNumber(balance!, 4));
                // console.log(balanceEth);
                setBalanceUsd(balanceEth * avaxUsdPrice);
            }
        }
        updateData();
    }, [props, allowToggleBalance]);

    function toggleBalanceUsd() {
        setShowBalanceUsd(!showBalanceUsd);
    }

    let balanceString;

    if (showBalanceUsd) {
        balanceString = `$ ${balanceUsd.toFixed(2)}`;
    } else {
        balanceString = `${props.currency} ${formatEthersNumber(balance, 4)}`;
    }

    let balanceHtml = (<span>{balanceString}</span>);

    if (allowToggleBalance) {
        return (<span onClick={toggleBalanceUsd}>{balanceString}</span>);
    } else {
        return (<span>{balanceString}</span>);
    }
}