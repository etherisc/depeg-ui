import { useContext, useState } from "react";
import { AppContext } from "../../../context/app_context";
import Typography from '@mui/material/Typography'
import { utils } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { DOT } from "../../../utils/chars";

export default function ChainData() {

    const appContext = useContext(AppContext);
    let chainData = (<></>);
    const [lastBlock, setLastBlock] = useState(0);
    const [gasPrice, setGasPrice] = useState("");

    const getAndSubscribeToLastBlock = async (provider: Web3Provider) => {
        // get current block number
        setLastBlock(await provider.getBlockNumber());
        // get current gas price
        setGasPrice(utils.formatUnits(await provider.getGasPrice(), "gwei"));

        // now subscribe to future updates
        provider.on("block", async (blockNumber) => {
            setLastBlock(blockNumber);
            setGasPrice(utils.formatUnits(await provider.getGasPrice(), "gwei"));
        });
    };
    
    if (appContext?.data.provider !== undefined) {
        const provider = appContext?.data.provider;
        getAndSubscribeToLastBlock(provider);
    } else {
        if (lastBlock !== 0) {
            setLastBlock(0);
        }
    }


    if (lastBlock > 0) {
        chainData = (
            <Typography variant="body2" sx={{ fontSize: '10px' }}>
                {gasPrice} gwei {DOT} {lastBlock}
            </Typography>
        );
    }
    
    return (
        <>
            {chainData}
        </>
    );
}