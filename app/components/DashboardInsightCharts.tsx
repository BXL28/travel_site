import { BrandMark } from "./BrandMark";
import type { TripPopularityStats } from "~/lib/trip-popularity";
import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel,
    Inject,
    SeriesCollectionDirective,
    SeriesDirective,
    Tooltip,
} from "@syncfusion/ej2-react-charts";

type Props = {
    popularity: TripPopularityStats;
    /** How many trips were analyzed (for subtitle). */
    sampleSize: number;
};

function yAxisForCounts(counts: number[]) {
    const max = counts.length ? Math.max(...counts) : 0;
    const ceiling = Math.max(4, Math.ceil(max * 1.2));
    const interval = Math.max(1, Math.ceil(ceiling / 5));
    return { minimum: 0, maximum: ceiling, interval };
}

function InsightChart({
    title,
    subtitle,
    dataSource,
    xTitle,
    fill,
    emptyHint,
}: {
    title: string;
    subtitle: string;
    dataSource: { label: string; count: number }[];
    xTitle: string;
    fill: string;
    emptyHint: string;
}) {
    const y = yAxisForCounts(dataSource.map((d) => d.count));

    if (!dataSource.length) {
        return (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col min-h-[380px]">
                <h3 className="text-xl font-bold text-slate-900 mb-1 px-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6 px-2">{subtitle}</p>
                <div className="flex-1 flex items-center justify-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 mx-2">
                    <p className="text-slate-400 text-sm font-medium px-6 text-center">{emptyHint}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-1 px-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6 px-2">{subtitle}</p>
            <ChartComponent
                height="320px"
                chartArea={{ border: { width: 0 } }}
                primaryXAxis={{
                    valueType: "Category",
                    title: xTitle,
                    majorGridLines: { width: 0 },
                    labelRotation: 35,
                    labelIntersectAction: "Rotate45",
                }}
                primaryYAxis={{
                    minimum: y.minimum,
                    maximum: y.maximum,
                    interval: y.interval,
                    title: "Trips",
                    labelFormat: "n0",
                    majorGridLines: { width: 0, color: "#F1F5F9" },
                    lineStyle: { width: 0 },
                }}
                tooltip={{ enable: true, format: "${point.x}: ${point.y} trip(s)" }}
                background="transparent"
            >
                <Inject services={[ColumnSeries, Category, DataLabel, Tooltip]} />
                <SeriesCollectionDirective>
                    <SeriesDirective
                        dataSource={dataSource}
                        xName="label"
                        yName="count"
                        type="Column"
                        columnWidth={0.45}
                        fill={fill}
                        cornerRadius={{ topLeft: 8, topRight: 8 }}
                        marker={{ dataLabel: { visible: true, position: "Outer", font: { fontWeight: "600", size: "11px", color: "#64748B" } } }}
                    />
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    );
}

const DashboardInsightCharts = ({ popularity, sampleSize }: Props) => {
    const subtitle =
        sampleSize > 0
            ? `Based on ${sampleSize} most recent trip${sampleSize === 1 ? "" : "s"} in your database.`
            : "Create trips to see trends here.";

    return (
        <section className="mt-16" aria-label="Trip popularity insights">
            <div className="mb-10 text-center">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <BrandMark size="sm" />
                    <h2 className="text-3xl font-bold text-slate-900">Travel insights</h2>
                </div>
                <p className="text-slate-500">
                    Where people go, how they like to travel, and what they care about most.
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <InsightChart
                    title="Top destinations"
                    subtitle={subtitle}
                    dataSource={popularity.countries}
                    xTitle="Country"
                    fill="#3B82F6"
                    emptyHint="No country data yet. Generated trips will appear here."
                />
                <InsightChart
                    title="Travel styles"
                    subtitle={subtitle}
                    dataSource={popularity.travelStyles}
                    xTitle="Style"
                    fill="#8B5CF6"
                    emptyHint="Travel styles from your forms will aggregate here."
                />
                <InsightChart
                    title="Top interests"
                    subtitle={subtitle}
                    dataSource={popularity.interests}
                    xTitle="Interest"
                    fill="#0EA5E9"
                    emptyHint="Interests are counted from each generated itinerary."
                />
            </div>
        </section>
    );
};

export default DashboardInsightCharts;
