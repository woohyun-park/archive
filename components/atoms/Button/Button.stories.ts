import type { Meta, StoryObj } from "@storybook/react";

import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const BaseButton: Story = {
  args: {
    label: "Button",
  },
};

export const SmButton: Story = {
  args: {
    label: "Button",
    size: "sm",
  },
};

export const InactiveButton: Story = {
  args: {
    label: "Button",
    isActive: false,
  },
};

export const FullButton: Story = {
  args: {
    label: "Button",
    width: "full",
  },
};
