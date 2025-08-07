"use client";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  RefObject,
  createRef,
} from "react";
import { ReactNode } from "react";
import { Experiment } from "@/models/experiment";
import { Toast } from "primereact/toast";
import { Point } from "@/models/point";
import Sidebar from "@/components/Sidebar";

export const DataContext = createContext<{
  experiments: Experiment[];
  setExperiments: Dispatch<SetStateAction<Experiment[]>>;
  toast: RefObject<Toast | null>;
  selectedExperiments: any;
  setSelectedExperiments: Dispatch<SetStateAction<any>>;
  points: Point[];
  setPoints: Dispatch<SetStateAction<Point[]>>;
  closeSidebar: boolean;
  setCloseSidebar: Dispatch<SetStateAction<boolean>>;
}>({
  experiments: [],
  setExperiments: () => {},
  toast: createRef(),
  selectedExperiments: null,
  setSelectedExperiments: () => {},
  points: [],
  setPoints: () => {},
  closeSidebar: false,
  setCloseSidebar: () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedExperiments, setSelectedExperiments] = useState(null);
  const toast = useRef(null);
  const [closeSidebar, setCloseSidebar] = useState(false);

  const contextData = {
    experiments: experiments,
    setExperiments: setExperiments,
    points: points,
    setPoints: setPoints,
    selectedExperiments: selectedExperiments,
    setSelectedExperiments: setSelectedExperiments,
    toast: toast,
    closeSidebar: closeSidebar,
    setCloseSidebar: setCloseSidebar,
  };

  return (
    <DataContext.Provider value={contextData}>
      <Toast ref={toast} />
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </DataContext.Provider>
  );
};
