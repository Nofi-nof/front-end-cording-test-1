import { PureComponent, useState, type Key } from "react";
import type { Route } from "./+types/home";
import { Main } from "./main/main";
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
      <Main />
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
                {/* Y軸の数字が最初に作ったグラフの上限以上に広がらない */}
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
                    stroke="#8884d8"
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
