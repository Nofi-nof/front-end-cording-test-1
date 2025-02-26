import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { colors } from "~/constants/prefColors";
import { transformPopulationResult } from "./transformPopulationResult";
import { usePopulationQueries } from "./usePopulationQueries";
import type { Prefecture } from "~/types/Prefecture";

type Props = {
  selectedPrefCode: Prefecture[];
  selectedKey: number;
};

export function DisplayPopulationGraph({
  selectedPrefCode,
  selectedKey,
}: Props) {
  // 選択された県の人口データ
  const queries = usePopulationQueries(selectedPrefCode);

  return (
    <div className="w-5/6 h-80 md:pl-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={transformPopulationResult(queries, selectedKey)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid stroke="none" strokeDasharray="3 3" />
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
              stroke={colors[query.data?.pref.prefCode || 0 % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
