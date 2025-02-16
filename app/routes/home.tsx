import { useState } from "react";
import type { Route } from "./+types/home";
import { Main } from "./main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type PrefecturesResponse = {
  message: string;
  result: Prefectures[];
};

interface Prefectures {
  prefCode: number;
  prefName: string;
}

export async function clientLoader() {
  const url =
    "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures";
  const apiKey = import.meta.env.VITE_API_KEY as string;

  const response = await fetch(url, {
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

export default function Home({ loaderData }: Route.ComponentProps) {
  const [selectedPrefCode, setSelectedPrefCode] = useState<number[]>([]);
  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefCode((prev) =>
      prev.includes(prefCode)
        ? prev.filter((item) => item !== prefCode)
        : [...prev, prefCode],
    );
  };
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
                onChange={() => handleCheckboxChange(pref.prefCode)}
              />
              {pref.prefCode}
              {pref.prefName}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
