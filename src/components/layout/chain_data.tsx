import { useContext, useState } from "react";
import { AppContext } from "../../context/app_context";
import Typography from '@mui/material/Typography'
import { Web3Provider } from "@ethersproject/providers";
import { DOT } from "../../utils/chars";
import { useDispatch, useSelector } from "react-redux";
import { setBlock } from "../../redux/slices/chain_slice";
import { RootState } from "../../redux/store";
import moment from "moment";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"; 
import { grey } from '@mui/material/colors';

export default function ChainData() {

    const appContext = useContext(AppContext);
    let chainData = (<></>);
    const dispatch = useDispatch();

    const blockNumber = useSelector((state: RootState) => state.chain.blockNumber);
    const blockTime = useSelector((state: RootState) => state.chain.blockTime);
    
    async function blockListener(blockNumber: number) {
        const provider = appContext.data.provider!;
        const blockTime = (await provider.getBlock(blockNumber)).timestamp;
        dispatch(setBlock([blockNumber, blockTime ]));
    }

    async function getAndSubscribeToLastBlock(provider: Web3Provider) {
        // TODO: move this to provider initialization
        const blockNumber = await provider.getBlockNumber();
        const blockTime = (await provider.getBlock(blockNumber)).timestamp;
        dispatch(setBlock([blockNumber, blockTime ]));

        // now subscribe to future updates
        provider.removeListener("block", blockListener);
        provider.on("block", blockListener); 
    };

    function formatUtc(timestamp: number): string {
        return moment(timestamp * 1000).utc().format("YYYY-MM-DD HH:mm:ss") + " UTC";
    }

    function formatLocal(timestamp: number): string {
        return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss") + " Local";
    }
    
    if (appContext?.data.provider !== undefined) {
        const provider = appContext?.data.provider;
        getAndSubscribeToLastBlock(provider);
    } else {
        if (blockNumber !== 0) {
            dispatch(setBlock([0, 0]));
        }
    }

    let timestamp = `Time: ${formatUtc(blockTime)} / ${formatLocal(blockTime)}`;
    timestamp += `, Block time: ${blockTime}`;
    timestamp += `, Block number: ${blockTime}`;

    if (blockNumber > 0) {
        chainData = (
            <Tooltip title={timestamp}>
                <Typography variant="body2" sx={{ fontSize: '10px', ml: 1 }}>
                    {blockNumber} 
                    <FontAwesomeIcon icon={faCircleInfo} className="fa" />
                </Typography>
            </Tooltip>
        );
    }
    
    return (
        <>
            {chainData}
        </>
    );
}