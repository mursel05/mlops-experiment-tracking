"use client";
import { DataContext } from "@/context/ApiContext";
import { Experiment } from "@/models/experiment";
import { useContext, useMemo } from "react";
import { Point } from "@/models/point";
import dynamic from "next/dynamic";

interface LineChartProps {
  index: number;
}

const LineChart = ({ index }: LineChartProps) => {
  const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
  const { selectedExperiments, points, closeSidebar } = useContext(DataContext);

  const efficientSample = (data: Point[], maxPoints = 1000) => {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
  };

  const { plotData, layout } = useMemo(() => {
    if (
      !selectedExperiments?.length ||
      !selectedExperiments[0]?.metrics[index]
    ) {
      return { plotData: [], layout: {} };
    }
    const metricName = selectedExperiments[0].metrics[index].name;
    const colors = [
      "#FFCB33",
      "#33BFFF",
      "#E62E7B",
      "#2EE6CA",
      "#9D7AFF",
      "#FF6F61",
    ];
    const traces = selectedExperiments.map(
      (experiment: Experiment, i: number) => {
        const experimentPoints = points
          .filter(
            (point) =>
              point.experiment_id === experiment.experiment_id &&
              point.metric_name === metricName
          )
          .sort((a, b) => a.step - b.step);
        const sampledPoints = efficientSample(experimentPoints, 1000);
        return {
          x: sampledPoints.map((point) => point.step),
          y: sampledPoints.map((point) => point.value),
          type: "scatter" as const,
          mode: "lines" as const,
          name: experiment.experiment_id,
          line: {
            color: colors[i % colors.length],
            width: 2,
          },
          hovertemplate:
            `<b>${experiment.experiment_id}</b><br>` +
            `Step: %{x}<br>` +
            `Value: %{y:.6f}<br>` +
            `<extra></extra>`,
          connectgaps: true,
        };
      }
    );

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--color-text");
    const bgColor = documentStyle.getPropertyValue("--color-light");
    const gridColor = documentStyle.getPropertyValue("--color-border");

    const plotLayout = {
      title: {
        text: metricName,
        font: {
          size: 18,
          color: textColor,
        },
        x: 0.02,
      },
      xaxis: {
        title: {
          text: "Step",
          font: { color: textColor, size: 14 },
        },
        tickfont: { color: textColor, size: 12 },
        gridcolor: gridColor,
        zerolinecolor: gridColor,
        linecolor: gridColor,
      },
      yaxis: {
        title: {
          text: "Value",
          font: { color: textColor, size: 14 },
        },
        tickfont: { color: textColor, size: 12 },
        gridcolor: gridColor,
        zerolinecolor: gridColor,
        linecolor: gridColor,
      },
      plot_bgcolor: bgColor,
      paper_bgcolor: bgColor,
      font: {
        family: "Inter, system-ui, sans-serif",
        color: textColor,
      },
      margin: {
        l: 60,
        r: 40,
        t: 60,
        b: 60,
      },
      hovermode: "x unified" as const,
      showlegend: true,
      legend: {
        orientation: "h" as const,
        x: 0.5,
        y: -0.15,
        xanchor: "center" as const,
        yanchor: "top" as const,
        font: {
          color: textColor,
          size: 12,
        },
        bgcolor: "rgba(0,0,0,0)",
        bordercolor: "rgba(0,0,0,0)",
        itemsizing: "constant" as const,
        itemwidth: 30,
      },
      autosize: true,
      responsive: true,
    };

    return { plotData: traces, layout: plotLayout };
  }, [selectedExperiments, points, index, closeSidebar]);

  const config = {
    displayModeBar: true,
    displaylogo: false,
    plotGlPixelRatio: 1,
    responsive: true,
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      config={config}
      useResizeHandler={true}
      className="p-2 w-full h-[25rem]"
    />
  );
};

export default LineChart;
