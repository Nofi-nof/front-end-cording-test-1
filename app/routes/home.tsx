import type { Route } from "./+types/home";
import type { PrefecturesResponse } from "~/types/PrefecturesResponse";
import { apiKey } from "~/constants/apiKey";
import { useState } from "react";
import type { Prefecture } from "~/types/Prefecture";
import { DisplayPopulationGraph } from "./displayPopulationGraph";
import { populationCategories } from "~/constants/population-categories";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// 県APIから県名と県コードを取得する
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

// 県一覧のチェックボックスを表示する
export default function DisplayPrefectures({
  loaderData,
}: Route.ComponentProps) {
  const [selectedPrefCode, setSelectedPrefCode] = useState<Prefecture[]>([]);
  const [selectedKey, setSelectedKey] = useState(0);

  //チェックボックスの選択を配列にする
  const handleCheckboxChange = (pref: Prefecture) => {
    setSelectedPrefCode((prev) =>
      prev.find((p) => p.prefCode === pref.prefCode)
        ? prev.filter((item) => item.prefCode !== pref.prefCode)
        : [...prev, pref],
    );
  };

  return (
    <div className="grid grid-cols-1 justify-items-center gap-10 p-10">
      <h1>47都道府県人口変遷グラフ</h1>
      <ul className="grid grid-cols-3 gap-5 md:grid-cols-9 ">
        {loaderData.map((pref) => (
          <li key={pref.prefCode}>
            <label>
              <input
                type="checkbox"
                value={pref.prefCode}
                onChange={() => handleCheckboxChange(pref)}
              />
              {pref.prefName}
            </label>
          </li>
        ))}
      </ul>
      <select
        className="w-72"
        onChange={(e) => setSelectedKey(parseInt(e.target.value, 10))}
      >
        <option value="">人口カテゴリーを選択してください</option>
        {populationCategories.slice(0, 4).map((populationCategory, index) => (
          <option className="w-6" key={index} value={index}>
            {populationCategory}
          </option>
        ))}
      </select>
      <DisplayPopulationGraph
        selectedPrefCode={selectedPrefCode}
        selectedKey={selectedKey}
      ></DisplayPopulationGraph>
    </div>
  );
}
