import type { Route } from "./+types/home";
import type { PrefecturesResponse } from "~/types/PrefecturesResponse";
import { apiKey } from "~/constants/apiKey";
import { useState } from "react";
import type { Prefecture } from "~/types/Prefecture";
import { DisplayPopulationGraph } from "./displayPopulationGraph";

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

  //チェックボックスの選択を配列にする
  const handleCheckboxChange = (pref: Prefecture) => {
    setSelectedPrefCode((prev) =>
      prev.find((p) => p.prefCode === pref.prefCode)
        ? prev.filter((item) => item.prefCode !== pref.prefCode)
        : [...prev, pref],
    );
  };

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
      <DisplayPopulationGraph
        selectedPrefCode={selectedPrefCode}
      ></DisplayPopulationGraph>
    </>
  );
}
