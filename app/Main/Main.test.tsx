import { Main } from "./main";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

test("「Hello」の文字が表示されるか", () => {
  render(<Main />);
  const target = screen.getByRole("heading", { level: 1 });
  expect(target).toHaveTextContent("Hello");
});
