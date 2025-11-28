import type { PopulationChartData } from "~/types/PopulationChartData";
import type { PopulationResponse } from "~/types/PopulationResponse";
import type { Prefecture } from "~/types/Prefecture";

//人口APIから取得したデータを{県名:人口}のオブジェクトに変換する
export const transformPopulationData = (
  apiData: PopulationResponse,
  pref: Prefecture,
) => {
  //総人口データを{県名:人口}のオブジェクトに変換する
  const totalPopulation = apiData.result.data[0].data.map(({ year, value }) => {
    const totalPopulation: PopulationChartData = { year };
    totalPopulation[pref.prefName] = value;

    return totalPopulation;
  });

  //年少人口データを{県名:人口}のオブジェクトに変換する
  const youngPopulation = apiData.result.data[1].data.map(({ year, value }) => {
    const youngPopulation: PopulationChartData = { year };
    youngPopulation[pref.prefName] = value;

    return youngPopulation;
  });

  //生産年齢人口を{県名:人口}のオブジェクトに変換する
  const workingAgePopulation = apiData.result.data[2].data.map(
    ({ year, value }) => {
      const workingAgePopulation: PopulationChartData = { year };
      workingAgePopulation[pref.prefName] = value;

      return workingAgePopulation;
    },
  );

  //老年人口を{県名:人口}のオブジェクトに変換する
  const elderlyPopulation = apiData.result.data[3].data.map(
    ({ year, value }) => {
      const elderlyPopulation: PopulationChartData = { year };
      elderlyPopulation[pref.prefName] = value;

      return elderlyPopulation;
    },
  );

  return {
    pref,
    result: [
      totalPopulation,
      youngPopulation,
      workingAgePopulation,
      elderlyPopulation,
    ],
  };
};
