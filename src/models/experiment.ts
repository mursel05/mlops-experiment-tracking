import { Metric } from "./metric";

export type Experiment = {
  experiment_id: string;
  metrics: Metric[];
};
