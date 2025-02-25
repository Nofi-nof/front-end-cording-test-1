import type { UseQueryResult } from "@tanstack/react-query";
import type { PopulationChartData } from "~/types/PopulationChartData";
import type { Prefecture } from "~/types/Prefecture";

//引数を選択された県と選択された人口カテゴリーのデータにしたい
// selectedPrefecture: (Prefecture | undefined)[],
// selectedQueries: (PopulationChartData[] | undefined)[],

// 選択した県の{県名:人口}のオブジェクトに変換したデータを配列に入れる
export const transformPopulationResult = (
  queries: UseQueryResult<
    {
      pref: Prefecture;
      result: PopulationChartData[][];
    },
    unknown
  >[],
  selectedKey: number,
) => {
  const result: PopulationChartData[] = [];

  for (const query of queries) {
    if (query.data?.result)
      for (const data of query.data?.result[selectedKey]) {
        const index = result.findIndex((r) => r.year === data.year);
        if (index !== -1) {
          result[index] = {
            ...result[index],
            [query.data?.pref.prefName!]: data[query.data?.pref.prefName!],
          };
          continue;
        }

        result.push({
          year: data.year,
          [query.data?.pref.prefName!]: data[query.data?.pref.prefName!],
        });
      }
  }

  return result;
};
