import * as stories from "./Button.stories";

import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

const { BaseButton, FullButton, InactiveButton, SmButton } =
  composeStories(stories);

it("should render BaseButton", () => {
  const { getByRole } = render(<BaseButton />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("text-base");
});

it("should render SmButton", () => {
  const { getByRole } = render(<SmButton />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("text-sm");
});

it("should render InactiveButton", () => {
  const { getByRole } = render(<InactiveButton />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("text-black");
});

it("should render FullButton", () => {
  const { getByRole } = render(<FullButton />);

  expect(getByRole("button")).toHaveTextContent("Button");
  expect(getByRole("button")).toHaveClass("w-full");
});
