import * as stories from "./Button.stories";

import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

const { Default, Full, Inactive } = composeStories(stories);

it("should render Default Button", () => {
  const { getByRole } = render(<Default />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("text-sm");
});

it("should render Inactive Button", () => {
  const { getByRole } = render(<Inactive />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("text-black");
});

it("should render Full Button", () => {
  const { getByRole } = render(<Full />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("w-full");
});
