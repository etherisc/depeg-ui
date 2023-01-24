import { formatUnits } from "ethers/lib/utils";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Colors, TimeSeriesScale, TimeScale } from 'chart.js'; 
import { LinearProgress } from "@mui/material";
import moment from "moment";

interface PriceHistoryProps {
    name: string;
    symbol: string;
    decimals: number;
    prices: PriceInfo[];
    isLoading: boolean;
}

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Colors, TimeSeriesScale, TimeScale);

export default function PriceHistory(props: PriceHistoryProps) {
    let labels = [] as string[];
    let dataset = [] as any;

    if (! props.isLoading) {
        dataset = props.prices.map(
            (price: PriceInfo) => {
                const ts = moment.utc(price.timestamp * 1000).format("MM-DD HH:mm");
                // const ts = price.timestamp;
                return { 
                    x: ts, 
                    y: parseFloat(formatUnits(price.price, props.decimals)) 
                }
            }
        );
    }

    const data = {
        labels,
        datasets: [{
            // label: `{props.symbol} price history`,
            data: dataset,
        }]
    };

    const options = {
        scales: {
            x: {
                // type: 'time',
                // time: {
                //     unit: 'second'
                // },
                ticks: {
                    autoSkip: true,
                    maxRotation: 30,
                    maxTicksLimit: 14,
                }
            },
            y: {
                suggestedMin: 0.95,
                suggestedMax: 1.05,
            }
        }
    }

    return (<>
        {props.isLoading && <LinearProgress />}
        <Line 
            options={options}
            data={data} />
    </>);
}