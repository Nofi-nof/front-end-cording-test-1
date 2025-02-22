import { useQueries } from "@tanstack/react-query";
import type { Prefecture } from "~/types/Prefecture";
import { fetchPopulationApiBySelectedPrefCode } from "./fetchPopulationApiBySelectedPrefCode";

//prefCodeを渡して、人口APIから県ごとのデータを取得する
export const usePopulationQueries = (selectedPref: Prefecture[]) => {
  const results = useQueries({
    queries: selectedPref.map((pref) => ({
      queryKey: ["fetchPopulationApiBySelectedPrefCode", pref.prefCode],
      queryFn: () => fetchPopulationApiBySelectedPrefCode(pref),
    })),
  });

  return results;
};
