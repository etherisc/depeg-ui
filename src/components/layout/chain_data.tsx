import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from "react-redux";
import { setBlock } from "../../redux/slices/chain";
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
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);
    
    function formatUtc(timestamp: number): string {
        return moment(timestamp * 1000).utc().format("YYYY-MM-DD HH:mm:ss") + " UTC";
    }

    function formatLocal(timestamp: number): string {
        return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss") + " Local";
    }
    
    if (! isConnected) {
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