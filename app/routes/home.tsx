import { BrowserRouter } from "react-router";
import type { Route } from "./+types/home";
import { Main } from "./main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  <BrowserRouter basename="/front-end-cording-test-1">
    <Main />
  </BrowserRouter>;
  return;
}
