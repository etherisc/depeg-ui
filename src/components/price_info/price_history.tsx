import { formatUnits } from "ethers/lib/utils";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Colors, TimeScale, Tooltip } from 'chart.js'; 
import { Box, Button, LinearProgress, useTheme } from "@mui/material";
import FakeData from "./fake_data";
import 'chartjs-adapter-moment';
import { useTranslation } from "next-i18next";
import Color from "color";

const TRIGGER_PRICE = 0.995;
const RECOVERY_PRICE = 0.999;


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
    const theme = useTheme();

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
                    // TODO: add product status to the data (once available)
                }
            }
        );
    }

    function getPointColor(ctx: any): string {
        console.log("getPointColor", ctx);
        const value = ctx?.parsed?.y;
        if ( value === undefined || ctx.type !== 'data') {
            return theme.palette.primary.light;
        }
        if (value < TRIGGER_PRICE) {
            return theme.palette.error.dark;
        }
        return theme.palette.primary.light;
    }


    function getSegmentColor(ctx: any): string {
        console.log("getSegmentColor", ctx, ctx.type);
        if (ctx.type !== 'segment' ) {
            return theme.palette.primary.light;
        }
        const p0 = ctx.p0;
        const p1 = ctx.p1;
        console.log(p0, p1);
        // TODO: if product is depegged, use red color
        if (p0.parsed.y < TRIGGER_PRICE || p1.parsed.y < TRIGGER_PRICE) {
            console.log("red");
            return theme.palette.warning.light;
        }
        return theme.palette.primary.light;
    }

    const data = {
        labels,
        datasets: [
            {
                label: `{props.symbol} price history`,
                data: dataset,
                borderColor: getPointColor,
                segment: {
                    borderColor: getSegmentColor,
                },
            },
            {
                label: "Trigger",
                data: props.prices.length > 0 ? [
                    { x: props.prices[0].timestamp * 1000, y: TRIGGER_PRICE },
                    { x: props.prices[props.prices.length - 1].timestamp * 1000, y: TRIGGER_PRICE },
                ] : [],
                borderColor: Color(theme.palette.error.light).fade(0.7).hexa(),
                // no point, no hover, no hit
                radius: 0,
                hoverRadius: 0,
                hitRadius: 0,
            },
            {
                label: "Recovery",
                data: props.prices.length > 0 ? [
                    { x: props.prices[0].timestamp * 1000, y: RECOVERY_PRICE },
                    { x: props.prices[props.prices.length - 1].timestamp * 1000, y: RECOVERY_PRICE },
                ] : [],
                borderColor: Color(theme.palette.success.light).fade(0.7).hexa(),
                // no point, no hover, no hit
                radius: 0,
                hoverRadius: 0,
                hitRadius: 0,
            },
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'time' as const,
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
                suggestedMin: 0.975,
                suggestedMax: 1.015,
            }
        },
        elements: {
            point: {
                pointStyle: 'circle',
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return props.symbol + " " + context.parsed.y;
                    }
                },
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
