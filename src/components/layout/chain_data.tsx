import Typography from '@mui/material/Typography'
import { Web3Provider } from "@ethersproject/providers";
import { useDispatch, useSelector } from "react-redux";
import { setBlock } from "../../redux/slices/chain_slice";
import { RootState } from "../../redux/store";
import moment from "moment";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"; 

export default function ChainData() {

    let chainData = (<></>);
    const dispatch = useDispatch();

    const blockNumber = useSelector((state: RootState) => state.chain.blockNumber);
    const blockTime = useSelector((state: RootState) => state.chain.blockTime);
    const provider = useSelector((state: RootState) => state.chain.provider);
    
    async function blockListener(blockNumber: number) {
        const blockTime = (await provider?.getBlock(blockNumber))?.timestamp ?? 0;
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
    
    if (provider !== undefined) {
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