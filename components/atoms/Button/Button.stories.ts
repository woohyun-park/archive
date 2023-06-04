import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: "Button",
  },
};

export const Inactive: Story = {
  args: {
    label: "Button",
    isActive: false,
  },
};

export const Full: Story = {
  args: {
    label: "Button",
    width: "full",
  },
};
