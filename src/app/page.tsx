"use client";
import LineChart from "@/components/LineChart";
import { DataContext } from "@/context/ApiContext";
import { Experiment } from "@/models/experiment";
import { useContext, useMemo } from "react";

export default function Home() {
  const { selectedExperiments, points } = useContext(DataContext);

  const uniqueMetrics = useMemo(() => {
    if (!selectedExperiments?.length) return [];
    const selectedIds = selectedExperiments.map(
      (exp: Experiment) => exp.experiment_id
    );
    const relevantPoints = points.filter((point) =>
      selectedIds.includes(point.experiment_id)
    );
    return [...new Set(relevantPoints.map((point) => point.metric_name))];
  }, [selectedExperiments, points]);

  if (!selectedExperiments?.length) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl text-gray-600">No experiments selected</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-[2rem] font-[500] text-(--color-text)">
        Charts for {selectedExperiments.length} Selected Experiments
      </h2>
      {uniqueMetrics.map((metricName, index) => (
        <LineChart key={index} index={index} />
      ))}
    </div>
  );
}
