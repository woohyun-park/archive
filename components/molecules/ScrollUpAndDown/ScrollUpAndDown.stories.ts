import type { Meta, StoryObj } from "@storybook/react";

import ScrollUpAndDown from "./ScrollUpAndDown";

const meta: Meta<typeof ScrollUpAndDown> = {
  title: "ScrollUpAndDown",
  component: ScrollUpAndDown,
};

export default meta;
type Story = StoryObj<typeof ScrollUpAndDown>;

export const Default: Story = {
  args: {},
};
