"use client";
import { DataContext } from "@/context/ApiContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Metric } from "@/models/metric";
import { Experiment } from "@/models/experiment";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const { experiments, selectedExperiments, setSelectedExperiments } =
    useContext(DataContext);
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [closeSidebar, setCloseSidebar] = useState(true);

  const metricsTemplate = (rowData: Experiment) => {
    return `${rowData.metrics.length} metrics`;
  };

  const totalPointsTemplate = (rowData: Experiment) => {
    const total = rowData.metrics.reduce(
      (sum: number, metric: Metric) => sum + metric.point_count,
      0
    );
    return total.toLocaleString();
  };

  const rowExpansionTemplate = (data: Experiment) => {
    return (
      <DataTable value={data.metrics} dataKey="name" className="mt-2">
        <Column field="name" header="Metric Name" />
        <Column field="point_count" header="Points" />
      </DataTable>
    );
  };

  if (closeSidebar) {
    return (
      <div className="flex flex-col gap-4 pt-4 border-r border-(--color-border) overflow-y-auto">
        <div className="flex px-4 justify-between items-center">
          <span
            className="pi pi-arrow-circle-right cursor-pointer"
            style={{
              fontSize: "1.5rem",
            }}
            onClick={() => setCloseSidebar(!closeSidebar)}></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-4 pt-4 border-r border-(--color-border) overflow-y-auto">
        <div className="flex px-4 justify-between items-center">
          {pathname === "/csv-upload" ? (
            <Button size="small" onClick={() => router.push("/")}>
              Return Home
            </Button>
          ) : (
            <Button size="small" onClick={() => router.push("/csv-upload")}>
              Import CSV
            </Button>
          )}
          <span
            className="pi pi-arrow-circle-left cursor-pointer"
            style={{
              fontSize: "1.5rem",
            }}
            onClick={() => setCloseSidebar(!closeSidebar)}></span>
        </div>
        <DataTable
          value={experiments}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          selection={selectedExperiments}
          onSelectionChange={(e) => setSelectedExperiments(e.value)}
          dataKey="experiment_id">
          <Column expander={true} />
          <Column selectionMode="multiple" />
          <Column field="experiment_id" header="Experiment ID" />
          <Column header="Metrics" body={metricsTemplate} />
          <Column header="Total Points" body={totalPointsTemplate} />
        </DataTable>
      </div>
    );
  }
}
