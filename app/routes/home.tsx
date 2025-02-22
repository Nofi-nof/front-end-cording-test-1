import { PureComponent, useState, type Key } from "react";
import type { Route } from "./+types/home";
import {
  useQueries,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type PrefecturesResponse = {
  message: string;
  result: Prefecture[];
};

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  value: number;
}

interface PopulationResponse {
  message: string;
  result: {
    boundaryYear: number;
    data: {
      label: string;
      data: PopulationData[];
    }[];
  };
}

type PopulationChartData = {
  year: number;
  [prefName: string]: number;
};
const apiKey = import.meta.env.VITE_API_KEY as string;

const colors = [
  "#FF6F61",
  "#FF8C42",
  "#FF9A8B",
  "#FFA07A",
  "#E9967A",
  "#DC143C",
  "#C71585",
  "#D2691E",
  "#CD853F",
  "#FFB347",
  "#FFD700",
  "#DAA520",
  "#B8860B",
  "#ADFF2F",
  "#9ACD32",
  "#6B8E23",
  "#556B2F",
  "#3CB371",
  "#2E8B57",
  "#66CDAA",
  "#20B2AA",
  "#48D1CC",
  "#5F9EA0",
  "#4682B4",
  "#6495ED",
  "#4169E1",
  "#1E90FF",
  "#87CEFA",
  "#87CEEB",
  "#00BFFF",
  "#5A9BD3",
  "#7B68EE",
  "#6A5ACD",
  "#483D8B",
  "#8A2BE2",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#D8BFD8",
  "#DDA0DD",
  "#EE82EE",
  "#F08080",
  "#CD5C5C",
  "#A52A2A",
  "#8B4513",
  "#BC8F8F",
  "#708090",
];

export async function clientLoader() {
  const prefecturesUrl =
    "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures";

  const response = await fetch(prefecturesUrl, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const { result } = (await response.json()) as PrefecturesResponse;

  return result;
}

//チェックボックスの選択を配列にする
export default function Home({ loaderData }: Route.ComponentProps) {
  const [selectedPrefCode, setSelectedPrefCode] = useState<Prefecture[]>([]);
  const handleCheckboxChange = (pref: Prefecture) => {
    setSelectedPrefCode((prev) =>
      prev.find((p) => p.prefCode === pref.prefCode)
        ? prev.filter((item) => item.prefCode !== pref.prefCode)
        : [...prev, pref],
    );
  };
  const queries = usePopulationQueries(selectedPrefCode);

  return (
    <>
      <h1>47都道府県人口変遷グラフ</h1>
      <ul>
        {loaderData.map((pref) => (
          <li key={pref.prefCode}>
            <label>
              <input
                type="checkbox"
                value={pref.prefCode}
                onChange={() => handleCheckboxChange(pref)}
              />
              {pref.prefCode}
              {pref.prefName}
            </label>
          </li>
        ))}
      </ul>
      <ul>
        <li>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={transformResult(queries)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {queries.map((query) => (
                  <Line
                    key={query.data?.pref.prefCode}
                    type="monotone"
                    dataKey={query.data?.pref.prefName}
                    // 県の番号がundefinedになったときは0番目の色になる
                    stroke={
                      colors[query.data?.pref.prefCode || 0 % colors.length]
                    }
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </li>
      </ul>
    </>
  );
}

//人口APIからデータを取得する
const fetchPopulationApiBySelectedPrefCode = async (pref: Prefecture) => {
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

  return transformData(data, pref);
};

//prefCodeを渡して、人口APIから県ごとのデータを取得する
const usePopulationQueries = (selectedPref: Prefecture[]) => {
  const results = useQueries({
    queries: selectedPref.map((pref) => ({
      queryKey: ["fetchPopulationApiBySelectedPrefCode", pref.prefCode],
      queryFn: () => fetchPopulationApiBySelectedPrefCode(pref),
    })),
  });

  return results;
};

//人口APIから取得したデータを{県名:人口}のオブジェクトに変換する
const transformData = (apiData: PopulationResponse, pref: Prefecture) => {
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

// 選択した県の{県名:人口}のオブジェクトに変換したデータを配列に入れる
const transformResult = (
  queries: UseQueryResult<
    {
      pref: Prefecture;
      result: PopulationChartData[];
    },
    unknown
  >[],
) => {
  const result: PopulationChartData[] = [];

  for (const query of queries) {
    if (query.data?.result)
      for (const data of query.data?.result) {
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
