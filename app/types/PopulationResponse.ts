import type { PopulationData } from "./PopulationData";

export interface PopulationResponse {
  message: string;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: PopulationData[];
    }[];
  };
}
