import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Main } from "~/Main";

test("「Hello」の文字が表示されるか", () => {
  render(<Main />);
  const target = screen.getByRole("heading", { level: 1 });
  expect(target).toHaveTextContent("Hello");
});
