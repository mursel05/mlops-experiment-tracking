"use client";
import { DataContext } from "@/context/ApiContext";
import { Experiment } from "@/models/experiment";
import { ChartData } from "chart.js/auto";
import { Chart } from "primereact/chart";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface LineChartProps {
  index: number;
}

const LineChart = ({ index }: LineChartProps) => {
  const { selectedExperiments, points, setLoading } = useContext(DataContext);
  const [chartOptions, setChartOptions] = useState({});
  const [chartData, setChartData] = useState<ChartData>();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--color-text");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--color-text-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--color-border");

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      animation: {
        duration: 0,
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        filter: function (tooltipItem: any) {
          return tooltipItem.dataIndex % 10 === 0;
        },
      },
      scales: {
        x: {
          type: "linear" as const,
          position: "bottom" as const,
          title: {
            display: true,
            text: "Step",
            color: textColor,
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
            color: textColor,
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartOptions(options);
  }, []);

  useEffect(() => {
    setLoading(true);
    const metricName = selectedExperiments[0].metrics[index].name;
    const colors = [
      "#FFCB33",
      "#33BFFF",
      "#E62E7B",
      "#2EE6CA",
      "#9D7AFF",
      "#FF6F61",
    ];

    const datasets = selectedExperiments.map(
      (experiment: Experiment, i: number) => {
        const experimentPoints = points
          .filter(
            (point) =>
              point.experiment_id === experiment.experiment_id &&
              point.metric_name === metricName
          )
          .sort((a, b) => a.step - b.step);

        return {
          label: experiment.experiment_id,
          data: experimentPoints.map((point) => ({
            x: point.step,
            y: point.value,
          })),
          fill: false,
          borderColor: colors[i % colors.length],
          backgroundColor: colors[i % colors.length] + "20",
          tension: 0.4,
          pointRadius: 0,
        };
      }
    );
    setChartData({
      datasets: datasets,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [selectedExperiments, points, index]);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold p-4">
        {selectedExperiments[0].metrics[index].name}
      </h2>
      <div ref={ref} className="min-w-[25rem]">
        {inView ? (
          <Chart type="line" data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center font-[400] text-(color-text-secondary) text-[1rem]">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default LineChart;
