import type { PopulationChartData } from "~/types/PopulationChartData";
import type { PopulationResponse } from "~/types/PopulationResponse";
import type { Prefecture } from "~/types/Prefecture";

//人口APIから取得したデータを{県名:人口}のオブジェクトに変換する
export const transformPopulationData = (
  apiData: PopulationResponse,
  pref: Prefecture,
) => {
  const transformed = apiData.result.data[0].data.map(({ year, value }) => {
    const transformed: PopulationChartData = { year };
    transformed[pref.prefName] = value;

    return transformed;
  });

  return {
    pref,
    result: transformed,
  };
};
