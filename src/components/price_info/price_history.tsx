import { formatUnits } from "ethers/lib/utils";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Colors, TimeScale, Tooltip } from 'chart.js'; 
import { LinearProgress } from "@mui/material";
import FakeData from "./fake_data";
import 'chartjs-adapter-moment';
import { useTranslation } from "next-i18next";


interface PriceHistoryProps {
    name: string;
    symbol: string;
    decimals: number;
    prices: PriceInfo[];
    isLoading: boolean;
}

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Colors, TimeScale, Tooltip);

export default function PriceHistory(props: PriceHistoryProps) {
    const { t } = useTranslation(['price', 'common']);

    let labels = [] as string[];
    let dataset = [] as any;

    if (! props.isLoading) {
        dataset = props.prices.map(
            (price: PriceInfo) => {
                // const ts = moment.utc(price.timestamp * 1000).format("MM-DD HH:mm");
                // const ts = price.timestamp;
                return { 
                    x: price.timestamp * 1000, 
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
                type: 'time' as const,
                time: {
                    // unit: 'seconds' as const,
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 30,
                    maxTicksLimit: 14,
                }
            },
            y: {
                title: {
                    display: true,
                    text: t('chart.y.title', { symbol: props.symbol })
                },
                suggestedMin: 0.98,
                suggestedMax: 1.02,
            }
        },
        elements: {
            point: {
                pointStyle: 'rectRot',
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return props.symbol + " " + context.parsed.y;
                    }
                }
            },
        }
    }

    const fakeData = process.env.NEXT_PUBLIC_FAKE_PRICE_FEED;

    return (<>
        {props.isLoading && <LinearProgress />}
        <Line 
            options={options}
            data={data} />
        {fakeData && <FakeData />}
    </>);
}
