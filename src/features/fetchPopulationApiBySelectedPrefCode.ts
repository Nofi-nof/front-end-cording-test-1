import { apiKey } from "~/constants/apiKey";
import type { PopulationResponse } from "~/types/PopulationResponse";
import type { Prefecture } from "~/types/Prefecture";
import { transformPopulationData } from "./transformPopulationData";

//人口APIからデータを取得する
export const fetchPopulationApiBySelectedPrefCode = async (
  pref: Prefecture,
) => {
  const response = await fetch(
    `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${pref.prefCode}`,
    {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch PopulationAPI");

  const data = (await response.json()) as PopulationResponse;

  return transformPopulationData(data, pref);
};
