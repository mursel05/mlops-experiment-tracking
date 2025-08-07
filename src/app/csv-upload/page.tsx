"use client";
import { DataContext } from "@/context/ApiContext";
import { FileUpload } from "primereact/fileupload";
import { useContext, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { Point } from "@/models/point";
import { Metric } from "@/models/metric";
import { Experiment } from "@/models/experiment";
import { InputSwitch } from "primereact/inputswitch";

export default function CSVUpload() {
  const { toast, setExperiments, setPoints, setLoading } =
    useContext(DataContext);
  const [removeZeroPoints, setRemoveZeroPoints] = useState(true);
  const router = useRouter();

  function processPointsToExperiments(points: Point[]) {
    const experimentsMap: Record<string, Experiment> = {};
    points.forEach((point) => {
      if (!experimentsMap[point.experiment_id]) {
        experimentsMap[point.experiment_id] = {
          experiment_id: point.experiment_id,
          metrics: [],
        };
      }
      const experiment = experimentsMap[point.experiment_id];
      let metric = experiment.metrics.find(
        (m: Metric) => m.name === point.metric_name
      );
      if (!metric) {
        metric = { name: point.metric_name, point_count: 0 };
        experiment.metrics.push(metric);
      }
      metric.point_count += 1;
    });
    return Object.values(experimentsMap);
  }

  const handleUpload = (event: { files: File[] }) => {
    setLoading(true);
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result;
        Papa.parse(contents as string, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value, field) => {
            if (field === "step" || field === "value") {
              return parseFloat(value);
            }
            return value.trim();
          },
          complete: (results) => {
            const cleanedData = results.data.map((row: any) => {
              const cleanRow: any = {};
              Object.keys(row).forEach((key) => {
                if (key.trim() !== "") {
                  cleanRow[key] = row[key];
                }
              });
              return cleanRow;
            });
            const validData = cleanedData.filter(
              (row: any) =>
                row.experiment_id &&
                row.metric_name &&
                !isNaN(row.step) &&
                !isNaN(row.value) &&
                (!removeZeroPoints || row.value !== 0)
            ) as Point[];
            setPoints(validData);
            const experiments = processPointsToExperiments(validData);
            setExperiments(experiments);
            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: `${validData.length} points uploaded successfully.`,
              life: 2000,
            });
            router.push("/");
            setLoading(false);
          },
          error: () => {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to parse CSV file.",
              life: 2000,
            });
          },
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-[2rem] text-(--color-text) font-[500]">
        Upload CSV File
      </h1>
      <div className="flex items-center gap-2">
        <InputSwitch
          inputId="input-remove-zero-points"
          checked={removeZeroPoints}
          onChange={(e) => setRemoveZeroPoints(e.value)}
        />
        <label
          htmlFor="input-remove-zero-points"
          className="text-sm text-gray-700">
          Remove Zero Points
        </label>
      </div>
      <FileUpload
        mode="basic"
        name="csv"
        accept=".csv"
        customUpload
        uploadHandler={handleUpload}
        chooseLabel="Upload CSV"
      />
    </div>
  );
}
